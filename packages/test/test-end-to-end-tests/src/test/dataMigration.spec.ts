/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { describeNoCompat } from "@fluid-internal/test-version-utils";
import { IContainer, IContainerContext, LoaderHeader } from "@fluidframework/container-definitions";
import { ITestObjectProvider, waitForContainerConnection } from "@fluidframework/test-utils";
import {
	ContainerRuntimeFactoryWithDefaultDataStore,
	DataObject,
	DataObjectFactory,
} from "@fluidframework/aqueduct";
import { SharedCell } from "@fluidframework/cell";
import { SharedMap } from "@fluidframework/map";
import {
	ContainerMessageType,
	ContainerRuntime,
	DefaultSummaryConfiguration,
	IContainerRuntimeOptions,
	SummarizerStopReason,
	detachedClientType,
	summarizerClientType,
} from "@fluidframework/container-runtime";
import { RuntimeFactoryHelper, requestFluidObject } from "@fluidframework/runtime-utils";
import { IDocumentStorageService } from "@fluidframework/driver-definitions";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { Deferred, TelemetryNullLogger } from "@fluidframework/common-utils";
import {
	IChannelAttributes,
	IChannelFactory,
	IChannelServices,
	IFluidDataStoreRuntime,
} from "@fluidframework/datastore-definitions";
import { readAndParse } from "@fluidframework/driver-utils";
import { ISnapshotTree, ISummaryAck, MessageType } from "@fluidframework/protocol-definitions";

const TestDataObjectType = "@fluid-example/test-dataStore";
const getterKey = "getter";
const cellKey = "cell";

class DataObjectV1 extends DataObject {
	public get containerRuntime() {
		return this.context.containerRuntime as ContainerRuntime;
	}
	public get getter(): SharedCell {
		assert(this._getter !== undefined, "unexpected get of getter before it was defined");
		return this._getter;
	}
	private _getter?: SharedCell;

	public get rootDDS() {
		return this.root;
	}

	protected async initializingFirstTime(props?: any): Promise<void> {
		const getter = SharedCell.create(this.runtime);
		this.root.set(getterKey, getter.handle);
		this._getter = getter;
		this._getter.set("abc");
	}

	protected async initializingFromExisting(): Promise<void> {
		const handle = this.root.get<IFluidHandle<SharedCell>>(getterKey);
		this._getter = await handle?.get();
	}
}

class DataObjectV2 extends DataObject {
	public get containerRuntime() {
		return this.context.containerRuntime as ContainerRuntime;
	}
	public get getter(): SharedMap {
		assert(this._getter !== undefined, "unexpected get of getter before it was defined");
		return this._getter;
	}
	private _getter?: SharedMap;
	public get rootDDS() {
		return this.root;
	}

	protected async initializingFirstTime(props?: any): Promise<void> {
		const getter = SharedMap.create(this.runtime);
		this.root.set(getterKey, getter.handle);
		this._getter = getter;
	}

	protected async initializingFromExisting(): Promise<void> {
		const handle = this.root.get<IFluidHandle<SharedMap>>(getterKey);
		this._getter = await handle?.get();
	}

	protected async hasInitialized(): Promise<void> {
		this.root.set("v2", "v2HERE");
	}
}

function createReadOnlyContext(
	context: IContainerContext,
	codeDetailsVersion: string,
): IContainerContext {
	console.log("readonly context -  - -- - - - - -");
	const readonlyContext: IContainerContext = {
		...context,
		connected: true,
		clientDetails: {
			capabilities: context.clientDetails.capabilities,
			type: detachedClientType,
		},
		storage: {
			...context.storage,
			getSnapshotTree: context.storage.getSnapshotTree,
			getVersions: context.storage.getVersions,
			createBlob: async (_file: ArrayBufferLike) => {
				throw new Error("Should not be submitting blobs to storage");
			},
			readBlob: context.storage.readBlob,
			uploadSummaryWithContext: async (_summary, _context) => {
				throw new Error("Should not be uploading a summary");
			},
			downloadSummary: context.storage.downloadSummary,
		},
		submitFn: (_message, _contents, _batch, _appData) => 0,
		submitSummaryFn: (_summaryOp, _referenceSequenceNumber?) => 0,
		submitBatchFn: (_batch, _referenceSequenceNumber?) => 0,
		submitSignalFn: (_contents: any) => {},
		disposeFn: context.disposeFn,
		closeFn: context.closeFn,
		updateDirtyContainerState: context.updateDirtyContainerState,
		getAbsoluteUrl: context.getAbsoluteUrl,
		getSpecifiedCodeDetails: () => {
			return { package: codeDetailsVersion };
		},
		getLoadedFromVersion: context.getLoadedFromVersion,
		attachState: context.attachState,
	};
	return readonlyContext;
}

class ContainerRuntimeFactoryWithDataMigration extends RuntimeFactoryHelper {
	private _currentRuntimeFactory?: ContainerRuntimeFactoryWithDefaultDataStore;
	private oldRuntime?: ContainerRuntime;
	private isOldClient: boolean = false;
	private get currentRuntimeFactory(): ContainerRuntimeFactoryWithDefaultDataStore {
		assert(
			this._currentRuntimeFactory !== undefined,
			"current should have been set before getting!",
		);
		return this._currentRuntimeFactory;
	}

	private clientDetailsType?: string;

	constructor(
		private readonly v1: ContainerRuntimeFactoryWithDefaultDataStore,
		private readonly v1ToV2: ContainerRuntimeFactoryWithDefaultDataStore,
		private readonly v2: ContainerRuntimeFactoryWithDefaultDataStore,
		private readonly deferred: Deferred<{
			summarizer: ContainerRuntime;
			readonlyRuntime: ContainerRuntime;
		}>,
	) {
		super();
	}
	public async preInitialize(
		context: IContainerContext,
		existing: boolean,
	): Promise<ContainerRuntime> {
		this.clientDetailsType = context.clientDetails.type;
		const codeDetails = context.getSpecifiedCodeDetails
			? context.getSpecifiedCodeDetails()
			: undefined;
		assert(codeDetails !== undefined, "get code details failed");

		this._currentRuntimeFactory = codeDetails.package === "v1" ? this.v1 : this.v2;
		this.isOldClient = codeDetails.package === "v1";
		if (this.clientDetailsType === detachedClientType) {
			const detachedContext = createReadOnlyContext(context, "v2");
			this._currentRuntimeFactory = this.v1ToV2;
			this.isOldClient = false;
			return this.currentRuntimeFactory.preInitialize(detachedContext, existing);
		}

		return this.currentRuntimeFactory.preInitialize(context, existing);
	}

	public async instantiateFirstTime(runtime: ContainerRuntime): Promise<void> {
		return this.currentRuntimeFactory.instantiateFirstTime(runtime);
	}

	public async instantiateFromExisting(runtime: ContainerRuntime): Promise<void> {
		return this.currentRuntimeFactory.instantiateFromExisting(runtime);
	}

	public async hasInitialized(runtime: ContainerRuntime): Promise<void> {
		console.log(`clientType: ${this.clientDetailsType}`);
		await this.currentRuntimeFactory.hasInitialized(runtime);

		if (this.clientDetailsType === summarizerClientType) {
			this.oldRuntime = runtime;
			const readonlyRuntime = await runtime.loadDetachedAndTransitionFn();
			console.log("loading new detached client");
			this.deferred.resolve({ summarizer: this.oldRuntime, readonlyRuntime });
		}
	}
}

class SharedCellToSharedMapFactory implements IChannelFactory {
	public static readonly Type = "https://graph.microsoft.com/types/cell";

	public get type(): string {
		return SharedCellToSharedMapFactory.Type;
	}

	public get attributes(): IChannelAttributes {
		return SharedMap.getFactory().attributes;
	}

	public async load(
		runtime: IFluidDataStoreRuntime,
		id: string,
		services: IChannelServices,
		attributes: IChannelAttributes,
	): Promise<SharedMap> {
		const cell = new SharedCell(id, runtime, attributes);
		await cell.load(services);
		const map = SharedMap.getFactory().create(runtime, id) as SharedMap;
		const val = cell.get();
		map.set(cellKey, val as string);
		return map;
	}

	public create(document: IFluidDataStoreRuntime, id: string): SharedMap {
		throw new Error("Shouldn't be making a shared cell");
	}
}

async function logTree(tree: ISnapshotTree, storage: IDocumentStorageService) {
	const newTree: any = {};
	newTree.blobs = {};
	newTree.trees = {};
	for (const [blobName, blobId] of Object.entries(tree.blobs)) {
		const content = await readAndParse(storage, blobId);
		newTree.blobs[blobName] = content;
	}
	for (const [treeName, treeNode] of Object.entries(tree.trees)) {
		newTree.trees[treeName] = await logTree(treeNode, storage);
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return newTree;
}

async function migrate(summarizerRuntime: ContainerRuntime, readonlyRuntime: ContainerRuntime) {
	console.log("starting data migration");

	(readonlyRuntime as any).summarizerNode.startSummary(
		readonlyRuntime.deltaManager.lastSequenceNumber,
		new TelemetryNullLogger(),
	);
	const appSummary = await readonlyRuntime.summarize({ fullTree: true });
	// const quorumSnapshot = (readonlyRuntime.getQuorum() as any).snapshot();
	// quorumSnapshot.values[0][1].value.package = "v2";
	// const documentAttributes: IDocumentAttributes = {
	// 	sequenceNumber: readonlyRuntime.deltaManager.lastSequenceNumber,
	// 	minimumSequenceNumber: readonlyRuntime.deltaManager.lastSequenceNumber,
	// 	term: undefined,
	// };
	// const protocolSummary: ISummaryTree = {
	// 	tree: {
	// 		attributes: {
	// 			content: JSON.stringify(documentAttributes),
	// 			type: SummaryType.Blob,
	// 		},
	// 		quorumMembers: {
	// 			content: JSON.stringify(quorumSnapshot.members),
	// 			type: SummaryType.Blob,
	// 		},
	// 		quorumProposals: {
	// 			content: JSON.stringify(quorumSnapshot.proposals),
	// 			type: SummaryType.Blob,
	// 		},
	// 		quorumValues: {
	// 			content: JSON.stringify(quorumSnapshot.values),
	// 			type: SummaryType.Blob,
	// 		},
	// 	},
	// 	type: SummaryType.Tree,
	// };

	// console.log(protocolSummary);

	// const summary: CombinedAppAndProtocolSummary = {
	// 	type: SummaryType.Tree,
	// 	tree: {
	// 		".protocol": protocolSummary,
	// 		".app": appSummary.summary,
	// 	},
	// };
	// console.log(summary);
	console.log("summarization finished");
	const storage = summarizerRuntime.storage;
	const neverCancel = new Deferred<SummarizerStopReason>();
	const runningSummarizer = (summarizerRuntime as any).summarizer.runningSummarizer;
	await runningSummarizer.summarizingLock;
	await runningSummarizer.lockedSummaryAction(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		() => runningSummarizer.beforeSummaryAction(),
		async () => {
			const result = await summarizerRuntime.submitSummary({
				fullTree: true,
				summaryLogger: new TelemetryNullLogger(),
				cancellationToken: {
					cancelled: false,
					waitCancelled: neverCancel.promise,
				},
				summarizeResult: appSummary,
			});
			assert(result.stage === "submit", "should have submitted summary");
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		() => runningSummarizer.afterSummaryAction(),
	);
	console.log("summary submitted");

	summarizerRuntime.on("op", (op) => {
		if (op.type === ContainerMessageType.Accept) {
			summarizerRuntime.disposeFn();
		}
	});
	console.log("uploaded");
	const waitForAck = new Deferred<ISummaryAck>();
	summarizerRuntime.on("op", (op) => {
		if (op.type === MessageType.SummaryAck) {
			waitForAck.resolve(op.contents);
		}
	});
	const ack = await waitForAck.promise;
	console.log("grabbing snapshot");
	console.log(
		JSON.stringify(await logTree((await storage.getSnapshotTree()) as ISnapshotTree, storage)),
	);
	summarizerRuntime.submitFinished("summaryHandle");
	summarizerRuntime.closeFn();
	return ack;
}

describeNoCompat("Data Migration is possible", (getTestObjectProvider) => {
	let provider: ITestObjectProvider;
	const runtimeOptions: IContainerRuntimeOptions = {
		summaryOptions: {
			summaryConfigOverrides: {
				...DefaultSummaryConfiguration,
				...{
					maxOps: 1,
					initialSummarizerDelayMs: 0,
					minIdleTime: 10,
					maxIdleTime: 10,
					nonRuntimeHeuristicThreshold: 1,
				},
			},
		},
		gcOptions: {
			disableGC: true,
			gcAllowed: false,
		},
	};
	const dataObjectFactoryV1 = new DataObjectFactory(
		TestDataObjectType,
		DataObjectV1,
		[SharedCell.getFactory()],
		[],
	);

	const dataObjectFactoryV1ToV2 = new DataObjectFactory(
		TestDataObjectType,
		DataObjectV2,
		[new SharedCellToSharedMapFactory()],
		[],
	);
	const dataObjectFactoryV2 = new DataObjectFactory(
		TestDataObjectType,
		DataObjectV2,
		[SharedMap.getFactory()],
		[],
	);
	const runtimeFactoryV1 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV1,
		[[dataObjectFactoryV1.type, Promise.resolve(dataObjectFactoryV1)]],
		undefined,
		undefined,
		runtimeOptions,
	);

	const runtimeFactoryV1ToV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV1ToV2,
		[[dataObjectFactoryV1ToV2.type, Promise.resolve(dataObjectFactoryV1ToV2)]],
		undefined,
		undefined,
		runtimeOptions,
	);

	const runtimeFactoryV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV2,
		[[dataObjectFactoryV2.type, Promise.resolve(dataObjectFactoryV2)]],
		undefined,
		undefined,
		runtimeOptions,
	);

	const deferred = new Deferred<{
		summarizer: ContainerRuntime;
		readonlyRuntime: ContainerRuntime;
	}>();

	const dataMigrationRuntimeFactoryV2 = new ContainerRuntimeFactoryWithDataMigration(
		runtimeFactoryV1,
		runtimeFactoryV1ToV2,
		runtimeFactoryV2,
		deferred,
	);

	const createV1Container = async (): Promise<IContainer> =>
		provider.createContainer(runtimeFactoryV1, undefined, { package: "v1" });

	const loadV2Container = async (summaryVersion: string): Promise<IContainer> =>
		provider.loadContainer(
			dataMigrationRuntimeFactoryV2,
			{ options: { cache: false } },
			{ headers: { [LoaderHeader.version]: summaryVersion, [LoaderHeader.cache]: false } },
			[
				[{ package: "v1" }, dataMigrationRuntimeFactoryV2],
				[{ package: "v2" }, dataMigrationRuntimeFactoryV2],
			],
		);

	const loadV2ContainerOnly = async (summaryVersion: string): Promise<IContainer> =>
		provider.loadContainer(
			runtimeFactoryV2,
			{ options: { cache: false } },
			{ headers: { [LoaderHeader.version]: summaryVersion, [LoaderHeader.cache]: false } },
			[[{ package: "v1" }, runtimeFactoryV2]],
		);

	beforeEach(async () => {
		provider = getTestObjectProvider({ syncSummarizer: true });
	});

	it("Can migrate with ContainerRuntimeFactory", async () => {
		// Setup container with basic dataObject
		const container = await createV1Container();
		const startObject = await requestFluidObject<DataObjectV1>(container, "/");
		startObject.rootDDS.set("an", "op");
		const waitForSummary = new Deferred<any>();
		startObject.containerRuntime.on("op", (op) => {
			if (op.type === MessageType.SummaryAck) {
				waitForSummary.resolve(op.contents);
			}
		});
		const firstSummaryAck = await waitForSummary.promise;
		container.close();
		console.log("loading v2...");
		const transitionContainer = await loadV2Container(firstSummaryAck.handle);
		await waitForContainerConnection(transitionContainer);
		await provider.ensureSynchronized();
		const dObject = await requestFluidObject<DataObjectV1>(transitionContainer, "/");
		dObject.containerRuntime.submitTransition();
		const waitForHandle = new Deferred<string>();
		dObject.containerRuntime.on("op", (op) => {
			if (op.type === ContainerMessageType.Accept) {
				const summaryHandle = op.contents.summaryHandle as string;
				waitForHandle.resolve(summaryHandle);
			}
		});
		console.log("loaded v2");
		const { summarizer, readonlyRuntime } = await deferred.promise;
		const waitForSummarizerRuntimeConnection = new Deferred<void>();
		summarizer.on("connected", () => {
			waitForSummarizerRuntimeConnection.resolve();
		});
		await waitForSummarizerRuntimeConnection.promise;
		const migrateAck = await migrate(summarizer, readonlyRuntime);
		console.log("summary submitted");
		const summaryVersion = migrateAck.handle;
		const tree = await readonlyRuntime.storage.getSnapshotTree();
		console.log(tree);
		assert(tree !== null, "snapshot should exist");
		const treeExpanded = await logTree(tree, readonlyRuntime.storage);
		console.log(treeExpanded);
		const migratedContainer = await loadV2ContainerOnly(summaryVersion);
		const migratedDataObject = await requestFluidObject<DataObjectV2>(migratedContainer, "/");
		assert(
			migratedDataObject.getter.get(cellKey) === "abc",
			"Document should have transitioned to v2!",
		);
	});
});
