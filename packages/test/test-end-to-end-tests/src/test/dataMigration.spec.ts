/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { describeNoCompat } from "@fluid-internal/test-version-utils";
import {
	AttachState,
	IAudience,
	IBatchMessage,
	IContainer,
	IContainerContext,
	IDeltaManager,
	IErrorBase,
	IFluidCodeDetails,
	ILoader,
	ILoaderOptions,
	LoaderHeader,
} from "@fluidframework/container-definitions";
import {
	ITestObjectProvider,
	summarizeNow,
	waitForContainerConnection,
} from "@fluidframework/test-utils";
import {
	ContainerRuntimeFactoryWithDefaultDataStore,
	DataObject,
	DataObjectFactory,
} from "@fluidframework/aqueduct";
import { SharedCell } from "@fluidframework/cell";
import { SharedMap } from "@fluidframework/map";
import {
	ContainerRuntime,
	DefaultSummaryConfiguration,
	IContainerRuntimeOptions,
	SummarizerStopReason,
	detachedClientType,
	summarizerClientType,
} from "@fluidframework/container-runtime";
import { RuntimeFactoryHelper, requestFluidObject } from "@fluidframework/runtime-utils";
import { IDocumentStorageService } from "@fluidframework/driver-definitions";
import { FluidObject, IFluidHandle, ITelemetryBaseLogger } from "@fluidframework/core-interfaces";
import { Deferred, TelemetryNullLogger } from "@fluidframework/common-utils";
import {
	IChannelAttributes,
	IChannelFactory,
	IChannelServices,
	IFluidDataStoreRuntime,
} from "@fluidframework/datastore-definitions";
import { readAndParse } from "@fluidframework/driver-utils";
import {
	IClientDetails,
	IDocumentMessage,
	IQuorumClients,
	ISequencedDocumentMessage,
	ISnapshotTree,
	ISummaryAck,
	ISummaryContent,
	IVersion,
	MessageType,
} from "@fluidframework/protocol-definitions";
import { SharedString } from "@fluidframework/sequence";

async function waitForSummarizeAck(emitter: ContainerRuntime | IContainer): Promise<ISummaryAck> {
	const waitForEventDeferred = new Deferred<ISummaryAck>();
	emitter.on("op", (op: ISequencedDocumentMessage) => {
		if (op.type === MessageType.SummaryAck) {
			waitForEventDeferred.resolve(op.contents as ISummaryAck);
		}
	});
	return waitForEventDeferred.promise;
}

const defaultRuntimeOptions: IContainerRuntimeOptions = {
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
};

const summaryRuntimeOptions: IContainerRuntimeOptions = {
	summaryOptions: {
		summaryConfigOverrides: {
			state: "disableHeuristics",
			maxAckWaitTime: 10000,
			maxOpsSinceLastSummary: 7000,
			initialSummarizerDelayMs: 0,
		},
	},
};

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
}

function createReadOnlyContext(
	context: IContainerContext,
	codeDetailsVersion: string,
): IContainerContext {
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
		if (this.clientDetailsType === detachedClientType) {
			const detachedContext = createReadOnlyContext(context, "v2");
			this._currentRuntimeFactory = this.v1ToV2;
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
		await this.currentRuntimeFactory.hasInitialized(runtime);

		if (this.clientDetailsType === summarizerClientType) {
			this.oldRuntime = runtime;
			const readonlyRuntime = await runtime.loadDetachedAndTransitionFn();
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
	(readonlyRuntime as any).summarizerNode.startSummary(
		readonlyRuntime.deltaManager.lastSequenceNumber,
		new TelemetryNullLogger(),
	);
	const appSummary = await readonlyRuntime.summarize({ fullTree: true });
	readonlyRuntime.disposeFn();
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
	summarizerRuntime.on("op", (op) => {
		if (op.type === MessageType.Accept) {
			summarizerRuntime.disposeFn();
		}
	});
	const waitForAck = new Deferred<ISummaryAck>();
	summarizerRuntime.on("op", (op) => {
		if (op.type === MessageType.SummaryAck) {
			waitForAck.resolve(op.contents);
		}
	});
	const ack = await waitForAck.promise;
	summarizerRuntime.submitFinished("summaryHandle");
	return ack;
}

describeNoCompat("Data Migration is possible", (getTestObjectProvider) => {
	let provider: ITestObjectProvider;

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
		defaultRuntimeOptions,
	);

	const runtimeFactoryV1ToV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV1ToV2,
		[[dataObjectFactoryV1ToV2.type, Promise.resolve(dataObjectFactoryV1ToV2)]],
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	const runtimeFactoryV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV2,
		[[dataObjectFactoryV2.type, Promise.resolve(dataObjectFactoryV2)]],
		undefined,
		undefined,
		defaultRuntimeOptions,
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
		const transitionContainer = await loadV2Container(firstSummaryAck.handle);
		await waitForContainerConnection(transitionContainer);
		await provider.ensureSynchronized();
		const dObject = await requestFluidObject<DataObjectV1>(transitionContainer, "/");
		dObject.containerRuntime.submitTransition();
		const { summarizer, readonlyRuntime } = await deferred.promise;
		const waitForSummarizerRuntimeConnection = new Deferred<void>();
		summarizer.on("connected", () => {
			waitForSummarizerRuntimeConnection.resolve();
		});
		await waitForSummarizerRuntimeConnection.promise;
		const migrateAck = await migrate(summarizer, readonlyRuntime);
		const summaryVersion = migrateAck.handle;
		transitionContainer.close();
		assert(container.closed, "Starting container should be closed");
		assert(transitionContainer.closed, "Transition container should have closed");
		const migratedContainer = await loadV2ContainerOnly(summaryVersion);
		const migratedDataObject = await requestFluidObject<DataObjectV2>(migratedContainer, "/");
		assert(
			migratedDataObject.getter.get(cellKey) === "abc",
			"Document should have transitioned to v2!",
		);
		migratedDataObject.getter.set("some", "value");
		await provider.ensureSynchronized();
		assert(!migratedContainer.closed, "Migrated container should be in good shape");
	});
});

class MigrationQueue {
	private readonly actions: (() => void)[] = [];
	public push(action: () => void) {
		this.actions.push(action);
	}

	public process() {
		for (const action of this.actions) {
			action();
		}
	}
}

class MigrationContainerContext implements IContainerContext {
	public migrationOn: boolean = false;
	public queue: MigrationQueue = new MigrationQueue();
	constructor(private readonly context: IContainerContext) {
		this.sequenceNumber = context.deltaManager.lastSequenceNumber;
		this.minimumSequenceNumber = context.deltaManager.lastSequenceNumber;
		this.clientSequenceNumber = context.deltaManager.lastSequenceNumber;
		this.referenceSequenceNumber = context.deltaManager.lastSequenceNumber;
	}
	private readonly sequenceNumber: number;
	private readonly minimumSequenceNumber: number;
	private readonly clientSequenceNumber: number;
	private readonly referenceSequenceNumber: number;
	private _runtime?: ContainerRuntime;
	private get runtime(): ContainerRuntime {
		assert(this._runtime !== undefined, "runtime needs to be set before retrieving this");
		return this._runtime;
	}
	public setRuntime(runtime: ContainerRuntime) {
		this._runtime = runtime;
	}
	public process() {
		this.queue.process();
	}
	options: ILoaderOptions = this.context.options;
	get clientId(): string | undefined {
		return this.context.clientId;
	}
	clientDetails: IClientDetails = this.context.clientDetails;
	storage: IDocumentStorageService = this.context.storage;
	connected: boolean = this.context.connected;
	baseSnapshot: ISnapshotTree | undefined = this.context.baseSnapshot;
	submitFn: (type: MessageType, contents: any, batch: boolean, appData?: any) => number = (
		type,
		contents,
		batch,
		appData,
	) => {
		if (!this.migrationOn) {
			return this.context.submitFn(type, contents, batch, appData);
		}

		this.queue.push(() => {
			const message: ISequencedDocumentMessage = {
				clientId: this.runtime.clientId ?? "",
				sequenceNumber: this.sequenceNumber,
				term: undefined,
				minimumSequenceNumber: this.minimumSequenceNumber,
				clientSequenceNumber: this.clientSequenceNumber,
				referenceSequenceNumber: this.referenceSequenceNumber,
				type,
				contents,
				timestamp: 0,
			};
			this.runtime.process(message, true);
		});

		return this.clientSequenceNumber;
	};
	submitBatchFn: (
		batch: IBatchMessage[],
		referenceSequenceNumber?: number | undefined,
	) => number = (batch, referenceSequenceNumber) => {
		if (!this.migrationOn) {
			return this.context.submitBatchFn(batch, referenceSequenceNumber);
		}
		this.queue.push(() => {
			for (const batchMessage of batch) {
				const message: ISequencedDocumentMessage = {
					clientId: this.runtime.clientId ?? "",
					sequenceNumber: this.sequenceNumber,
					term: undefined,
					minimumSequenceNumber: this.minimumSequenceNumber,
					clientSequenceNumber: this.clientSequenceNumber,
					referenceSequenceNumber: this.referenceSequenceNumber,
					type: MessageType.Operation,
					contents: batchMessage.contents,
					timestamp: 0,
				};
				this.runtime.process(message, true);
			}
		});
		return this.clientSequenceNumber;
	};
	submitSummaryFn: (
		summaryOp: ISummaryContent,
		referenceSequenceNumber?: number | undefined,
	) => number = this.context.submitSummaryFn;
	submitSignalFn: (contents: any) => void = (_) => {};
	disposeFn?: ((error?: IErrorBase | undefined) => void) | undefined = this.context.disposeFn;
	closeFn: (error?: IErrorBase | undefined) => void = this.context.closeFn;
	deltaManager: IDeltaManager<ISequencedDocumentMessage, IDocumentMessage> =
		this.context.deltaManager;
	quorum: IQuorumClients = this.context.quorum;
	getSpecifiedCodeDetails?: () => IFluidCodeDetails | undefined =
		this.context.getSpecifiedCodeDetails;
	audience: IAudience | undefined = this.context.audience;
	loader: ILoader = this.context.loader;
	taggedLogger: ITelemetryBaseLogger = this.context.taggedLogger;
	pendingLocalState?: unknown = this.context.pendingLocalState;
	scope: FluidObject = this.context.scope;
	getAbsoluteUrl?: (relativeUrl: string) => Promise<string | undefined> =
		this.context.getAbsoluteUrl;
	attachState: AttachState = this.context.attachState;
	getLoadedFromVersion: () => IVersion | undefined = this.context.getLoadedFromVersion;
	updateDirtyContainerState: (dirty: boolean) => void = this.context.updateDirtyContainerState;
	supportedFeatures?: ReadonlyMap<string, unknown> | undefined = this.context.supportedFeatures;
}

class ContainerRuntimeFactoryWithSummarizerDataMigration extends RuntimeFactoryHelper {
	private clientDetailsType?: string;
	private readonly waitForSummarizerCreation = new Deferred<ContainerRuntime>();
	public get summarizerRuntime() {
		return this.waitForSummarizerCreation.promise;
	}
	private _interactiveRuntime?: ContainerRuntime;
	public get interactiveRuntime() {
		assert(this._interactiveRuntime !== undefined);
		return this._interactiveRuntime;
	}

	constructor(
		private readonly containerRuntimeFactory: ContainerRuntimeFactoryWithDefaultDataStore,
	) {
		super();
	}
	public async preInitialize(
		context: IContainerContext,
		existing: boolean,
	): Promise<ContainerRuntime> {
		this.clientDetailsType = context.clientDetails.type;
		if (this.clientDetailsType === summarizerClientType) {
			const migrationContext = new MigrationContainerContext(context);
			return this.containerRuntimeFactory.preInitialize(migrationContext, existing);
		}

		return this.containerRuntimeFactory.preInitialize(context, existing);
	}

	public async instantiateFirstTime(runtime: ContainerRuntime): Promise<void> {
		return this.containerRuntimeFactory.instantiateFirstTime(runtime);
	}

	public async instantiateFromExisting(runtime: ContainerRuntime): Promise<void> {
		return this.containerRuntimeFactory.instantiateFromExisting(runtime);
	}

	public async hasInitialized(runtime: ContainerRuntime): Promise<void> {
		await this.containerRuntimeFactory.hasInitialized(runtime);
		if (this.clientDetailsType === summarizerClientType) {
			this.waitForSummarizerCreation.resolve(runtime);
		} else {
			this._interactiveRuntime = runtime;
		}
	}
}

const scriptType = "scriptType";
const sharedStringKey = "sharedStringKey";
class ScriptDO extends DataObject {
	private _sharedString?: SharedString;
	public get sharedString(): SharedString {
		assert(this._sharedString !== undefined, "should have set sharedString before retrieving");
		return this._sharedString;
	}
	public get stringContent(): string {
		return this.sharedString.getText();
	}
	protected async initializingFirstTime(props?: any): Promise<void> {
		const sharedString = SharedString.create(this.runtime);
		sharedString.insertText(0, "abc");
		this.root.set(sharedStringKey, sharedString.handle);
	}
	protected async hasInitialized(): Promise<void> {
		const handle = this.root.get<IFluidHandle<SharedString>>(sharedStringKey);
		assert(handle !== undefined, "Shared String dds should exist");
		this._sharedString = await handle.get();
	}
}

const rootType1 = "rootType1";
const rootType2 = "rootType2";
const scripts = 3;
class RootDOV1 extends DataObject {
	public get containerRuntime() {
		return this.context.containerRuntime as ContainerRuntime;
	}
	public get rootDDS() {
		return this.root;
	}
	public async getData() {
		const array: [string, ScriptDO][] = [];
		for (let i = 0; i < scripts; i++) {
			const key = `${i}`;
			const handle = this.root.get<IFluidHandle<ScriptDO>>(key);
			assert(handle !== undefined, "Script DO handle should have been stored");
			array.push([key, await handle.get()]);
		}
		return array;
	}

	protected async initializingFirstTime(props?: any): Promise<void> {
		for (let i = 0; i < scripts; i++) {
			const ds = await this.containerRuntime.createDataStore(scriptType);
			const fluidObject = await ds.entryPoint?.get();
			assert(fluidObject !== undefined, "should have created a data object");
			const scriptDO = fluidObject as ScriptDO;
			this.root.set(`${i}`, scriptDO.handle);
		}
	}
}

class RootDOV2 extends DataObject {
	public get containerRuntime() {
		return this.context.containerRuntime as ContainerRuntime;
	}
	public get rootDDS() {
		return this.root;
	}
	public get data() {
		const array: string[] = [];
		for (let i = 0; i < scripts; i++) {
			const data = this.root.get<string>(`${i}`);
			assert(data !== undefined, "Data should have been stored");
			array.push(data);
		}
		return array;
	}

	protected async initializingFirstTime(props?: any): Promise<void> {
		for (let i = 0; i < scripts; i++) {
			this.root.set(`${i}`, "");
		}
	}
}

describeNoCompat("Data Migration combine stuff into one DDS", (getTestObjectProvider) => {
	let provider: ITestObjectProvider;

	const scriptDOFactory = new DataObjectFactory(
		scriptType,
		ScriptDO,
		[SharedString.getFactory()],
		[],
	);
	const rootDOFactoryV1 = new DataObjectFactory(rootType1, RootDOV1, [], []);
	const rootDOFactoryV2 = new DataObjectFactory(rootType2, RootDOV2, [], []);

	const runtimeFactoryV1 = new ContainerRuntimeFactoryWithDefaultDataStore(
		rootDOFactoryV1,
		[
			[rootDOFactoryV1.type, Promise.resolve(rootDOFactoryV1)],
			[scriptDOFactory.type, Promise.resolve(scriptDOFactory)],
		],
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	const runtimeFactoryV1ToV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		rootDOFactoryV2,
		[
			[rootDOFactoryV1.type, Promise.resolve(rootDOFactoryV1)],
			[rootDOFactoryV2.type, Promise.resolve(rootDOFactoryV2)],
			[scriptDOFactory.type, Promise.resolve(scriptDOFactory)],
		],
		undefined,
		undefined,
		summaryRuntimeOptions,
	);

	const conversionRuntimeFactory = new ContainerRuntimeFactoryWithSummarizerDataMigration(
		runtimeFactoryV1ToV2,
	);

	const runtimeFactoryV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		rootDOFactoryV2,
		[
			[rootDOFactoryV2.type, Promise.resolve(rootDOFactoryV2)],
			[scriptDOFactory.type, Promise.resolve(scriptDOFactory)],
		],
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	beforeEach(() => {
		provider = getTestObjectProvider();
	});

	it("Can migrate with ContainerRuntimeFactory with just summarizer", async () => {
		// v1 container
		const c1 = await provider.createContainer(runtimeFactoryV1);
		const do1 = await requestFluidObject<RootDOV1>(c1, "/");
		do1.rootDDS.set("some", "op");
		await waitForSummarizeAck(c1);
		c1.close();

		// this test skips detecting that data migration needs to occur.
		// That was already proven in the previous part, it's not worth figuring out as that part is relatively easy.

		// Migrate
		const c2 = await provider.loadContainer(conversionRuntimeFactory);
		await waitForContainerConnection(c2);
		const do2 = await requestFluidObject<RootDOV1>(c2, "/");
		do2.rootDDS.set("another", "op");
		(conversionRuntimeFactory.interactiveRuntime as any).summaryManager.forceSummarization();
		const scr3 = await conversionRuntimeFactory.summarizerRuntime;
		const summarizer = (scr3 as any).summarizer;
		const sdo3 = await requestFluidObject<RootDOV1>(scr3, "/");

		// conversion code - doesn't do replace
		// Note, I needed to actually do this as I was running into 0x173 (I have no idea why, wasn't worth investigating)
		const migrationContext = scr3.context as MigrationContainerContext;
		migrationContext.migrationOn = true;
		migrationContext.setRuntime(scr3);
		// Record the last known deltaManager sequence number
		const lastKnownNumber = scr3.deltaManager.lastKnownSeqNumber;

		const sdo3Converted = await rootDOFactoryV2.createInstance(scr3);
		for (const [key, value] of sdo3.rootDDS.entries()) {
			sdo3Converted.rootDDS.set(key, value);
		}
		for (const [key, scriptDO] of await sdo3.getData()) {
			sdo3Converted.rootDDS.set(key, scriptDO.stringContent);
		}
		sdo3.rootDDS.set("handle", sdo3Converted.handle);
		scr3.addedGCOutboundReference(sdo3.rootDDS.handle, sdo3Converted.handle);
		// need to wait for the outbox and inbox to be empty / all the ops get processed. Otherwise the test passes.
		// Because the ops aren't all processed we get GC unknown outbound routes event which is totally fine.
		(scr3 as any).flush();
		migrationContext.process();

		// submit the summary and then turn off the migration, maybe close the summarizer, doesn't really matter.
		const { summaryRefSeq, summaryVersion } = await summarizeNow(summarizer);
		// some check here for incremental summary
		// some check here to see that the summaryRefSeq did not go crazy.
		assert.equal(
			lastKnownNumber,
			summaryRefSeq,
			"lastKnownNumber before migration should match the summary sequence number!",
		);
		(scr3.context as any).migrateOn = false;

		// validation
		const c4 = await provider.loadContainer(runtimeFactoryV1ToV2, undefined, {
			headers: { [LoaderHeader.version]: summaryVersion },
		});
		const do4 = await requestFluidObject<RootDOV2>(c4, "/");
		const newDOHandle4 = do4.rootDDS.get<IFluidHandle<RootDOV2>>("handle");
		assert(newDOHandle4 !== undefined, "should have stored a handle");
		const newDO4 = await newDOHandle4.get();
		for (const data of newDO4.data) {
			assert(data === "abc", "should be properly set");
		}
		assert(newDO4.data.length === scripts, `Should have ${scripts} not ${newDO4.data.length}`);
	});
});
