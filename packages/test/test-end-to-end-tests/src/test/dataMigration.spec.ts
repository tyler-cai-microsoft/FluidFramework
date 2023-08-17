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
	BaseContainerRuntimeFactory,
	ContainerRuntimeFactoryWithDefaultDataStore,
	DataObject,
	DataObjectFactory,
	defaultRouteRequestHandler,
} from "@fluidframework/aqueduct";
import { SharedCell } from "@fluidframework/cell";
import { SharedDirectory, SharedMap } from "@fluidframework/map";
import {
	ContainerRuntime,
	DefaultSummaryConfiguration,
	IContainerRuntimeOptions,
	ISummarizer,
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
	SummaryType,
} from "@fluidframework/protocol-definitions";
import { SharedString } from "@fluidframework/sequence";
import {
	FluidDataStoreRegistryEntry,
	IFluidDataStoreRegistry,
	NamedFluidDataStoreRegistryEntries,
	NamedFluidDataStoreRegistryEntry,
} from "@fluidframework/runtime-definitions";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { RuntimeRequestHandler } from "@fluidframework/request-handler";

// Might be useful if you want to look at the snapshot tree to do some verification.
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

async function waitForSummarizeAck(emitter: ContainerRuntime | IContainer): Promise<ISummaryAck> {
	const waitForEventDeferred = new Deferred<ISummaryAck>();
	emitter.on("op", (op: ISequencedDocumentMessage) => {
		if (op.type === MessageType.SummaryAck) {
			waitForEventDeferred.resolve(op.contents as ISummaryAck);
		}
	});
	return waitForEventDeferred.promise;
}

async function waitForConnectedEvent(emitter: ContainerRuntime | IContainer): Promise<void> {
	const waitForEventDeferred = new Deferred<void>();
	emitter.once("connected", () => {
		waitForEventDeferred.resolve();
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

// This allows us to inject the readonly context when we create the "detached/readonly" container runtime
class ContainerRuntimeFactoryWithDataMigration extends RuntimeFactoryHelper {
	private _currentRuntimeFactory?: ContainerRuntimeFactoryWithDefaultDataStore;
	private get currentRuntimeFactory(): ContainerRuntimeFactoryWithDefaultDataStore {
		assert(
			this._currentRuntimeFactory !== undefined,
			"current should have been set before getting!",
		);
		return this._currentRuntimeFactory;
	}
	private readonly _waitForMigrationRuntimes = new Deferred<{
		summarizerRuntime: ContainerRuntime;
		readonlyRuntime: ContainerRuntime;
	}>();
	public get waitForMigrationRuntimes() {
		return this._waitForMigrationRuntimes.promise;
	}

	private clientDetailsType?: string;

	constructor(
		private readonly v1: ContainerRuntimeFactoryWithDefaultDataStore,
		private readonly v1ToV2: ContainerRuntimeFactoryWithDefaultDataStore,
	) {
		super();
	}
	public async preInitialize(
		context: IContainerContext,
		existing: boolean,
	): Promise<ContainerRuntime> {
		this.clientDetailsType = context.clientDetails.type;

		this._currentRuntimeFactory = this.v1;
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
			const readonlyRuntime = await runtime.loadDetachedAndTransitionFn();
			this._waitForMigrationRuntimes.resolve({ summarizerRuntime: runtime, readonlyRuntime });
		}
	}
}

// This is a special conversion factory written specifically for this document to transition a shared cell to a shared map.
// Customers will need to write some conversion code that is in the load flow.
class SharedCellToSharedMapFactory implements IChannelFactory {
	// Note this type is shared cell so that we don't run into channel type not available
	public static readonly Type = "https://graph.microsoft.com/types/cell";

	public get type(): string {
		return SharedCellToSharedMapFactory.Type;
	}

	// Note we are using the shared map attributes here
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
		// Calling sharedMap.load here doesn't work as loadCore loads the shared map from the shared cell snapshot which obviously breaks.
		// We could change the load flow here as it would allow us to connect to services independently of loading from the snapshot.
		return map;
	}

	public create(document: IFluidDataStoreRuntime, id: string): SharedMap {
		throw new Error("Shouldn't be making a shared cell");
	}
}

// This function is responsible for generating the summary.
async function migrate(summarizerRuntime: ContainerRuntime, readonlyRuntime: ContainerRuntime) {
	(readonlyRuntime as any).summarizerNode.startSummary(
		readonlyRuntime.deltaManager.lastSequenceNumber,
		new TelemetryNullLogger(),
	);

	// I wonder if we could make this summary incremental by making sure just the part that changed is dirty.
	// There will be some work if we want to submit a summary foreign to us.
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

	const ack = await waitForSummarizeAck(summarizerRuntime);
	// submits the "migration is finished op". There are several solutions, this is just a lazy implementation of one.
	// I think putting the "migration is finished" on the summarize ack is best in terms of flow and reducing op counts.
	summarizerRuntime.finishProposal("summaryHandle");
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

	// Note the SharedCellToSharedMapFactory is here.
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

	// This is the runtime factory before we introduce data migration.
	const runtimeFactoryV1 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV1,
		[[dataObjectFactoryV1.type, Promise.resolve(dataObjectFactoryV1)]],
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	// This is the "conversion" factory
	const runtimeFactoryV1ToV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV1ToV2,
		[[dataObjectFactoryV1ToV2.type, Promise.resolve(dataObjectFactoryV1ToV2)]],
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	// This is for verification purposes.
	const runtimeFactoryV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		dataObjectFactoryV2,
		[[dataObjectFactoryV2.type, Promise.resolve(dataObjectFactoryV2)]],
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	const dataMigrationRuntimeFactoryV2 = new ContainerRuntimeFactoryWithDataMigration(
		runtimeFactoryV1,
		runtimeFactoryV1ToV2,
	);

	const createV1Container = async (): Promise<IContainer> =>
		provider.createContainer(runtimeFactoryV1);

	const loadV2TransitionContainer = async (summaryVersion?: string): Promise<IContainer> =>
		provider.loadContainer(dataMigrationRuntimeFactoryV2, undefined, {
			headers: { [LoaderHeader.version]: summaryVersion },
		});

	const loadV2ContainerOnly = async (summaryVersion: string): Promise<IContainer> =>
		provider.loadContainer(runtimeFactoryV2, undefined, {
			headers: { [LoaderHeader.version]: summaryVersion },
		});

	beforeEach(async () => {
		provider = getTestObjectProvider({ syncSummarizer: true });
	});

	it("Can migrate with ContainerRuntimeFactory", async () => {
		// Setup container with basic dataObject with a summary to load from
		const container1 = await createV1Container();
		container1.close();

		const container2 = await loadV2TransitionContainer();
		await waitForContainerConnection(container2);
		await provider.ensureSynchronized();
		const dataObject2 = await requestFluidObject<DataObjectV1>(container2, "/");

		// This sends the "quorum" proposal op. This doesn't do everything we want it to do, but it's not important as that part is relatively easy.
		dataObject2.containerRuntime.startProposal();
		// This gets both the summarization runtime and detached/readonly runtime. This code isn't production ready or really readable.
		// Above this deferred promise is passed to the runtime factory which then resolves the promise once it has created all the runtimes.
		const { summarizerRuntime: summarizerRuntime2, readonlyRuntime: readonlyRuntime2 } =
			await dataMigrationRuntimeFactoryV2.waitForMigrationRuntimes;
		await waitForConnectedEvent(summarizerRuntime2);

		// This loads the readonly runtime and then generates a summary
		// It then submits that summary with the summarizer runtime.
		const migrateAck = await migrate(summarizerRuntime2, readonlyRuntime2);

		// Grab the new summary from the summary ack
		const summaryVersion2 = migrateAck.handle;
		container2.close();
		assert(container1.closed, "Starting container should be closed");
		assert(container2.closed, "Transition container should have closed");

		// Load the container from the ack and do some verification that this container is in the v2 state.
		const container3 = await loadV2ContainerOnly(summaryVersion2);
		const dataObject3 = await requestFluidObject<DataObjectV2>(container3, "/");
		assert(
			dataObject3.getter.get(cellKey) === "abc",
			"Document should have transitioned to v2!",
		);
		dataObject3.getter.set("some", "value");
		await provider.ensureSynchronized();
		assert(!container3.closed, "Migrated container should be in good shape");
	});
});

// /////// Start of Prototype 2

// Not sure what the right implementation here is
// Essentially the goal is to pretend to be the service when processing ops.
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

// This is the container context that has two modes - migration mode and regular mode.
class MigrationContainerContext implements IContainerContext {
	public migrationOn: boolean = false;
	public queue: MigrationQueue = new MigrationQueue();
	constructor(private readonly context: IContainerContext) {
		this.sequenceNumber = context.deltaManager.lastSequenceNumber;
		this.minimumSequenceNumber = context.deltaManager.lastSequenceNumber;
		this.clientSequenceNumber = context.deltaManager.lastSequenceNumber;
		this.referenceSequenceNumber = context.deltaManager.lastSequenceNumber;
	}

	// Honestly, not sure which number should be what, so I made them all the same.
	private readonly sequenceNumber: number;
	private readonly minimumSequenceNumber: number;
	private readonly clientSequenceNumber: number;
	private readonly referenceSequenceNumber: number;
	private _runtime?: ContainerRuntime;
	private get runtime(): ContainerRuntime {
		assert(this._runtime !== undefined, "runtime needs to be set before retrieving this");
		return this._runtime;
	}

	// The runtime needs to be passed the context first, so once it's created, we pass back the runtime.
	public setRuntime(runtime: ContainerRuntime) {
		this._runtime = runtime;
	}

	// Added this queue so that the local message would be processed properly
	public process() {
		this.queue.process();
	}

	// I don't think we use this, but I overwrote it just in case
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
				timestamp: 0, // Seems like something important to discuss especially in terms of GC
			};
			this.runtime.process(message, true);
		});

		return this.clientSequenceNumber;
	};

	// This method should be looked at.
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
					timestamp: 0, // Seems like something important to discuss especially in terms of GC
				};
				this.runtime.process(message, true);
			}
		});
		return this.clientSequenceNumber;
	};

	// All these should be whatever the context originally returns
	options: ILoaderOptions = this.context.options;
	get clientId(): string | undefined {
		return this.context.clientId;
	}
	clientDetails: IClientDetails = this.context.clientDetails;
	storage: IDocumentStorageService = this.context.storage;
	connected: boolean = this.context.connected;
	baseSnapshot: ISnapshotTree | undefined = this.context.baseSnapshot;
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

// Put all shared object factories in here? Not exactly sure. What if a customer wants a custom DDS? Allow them to input a factory.
// Haven't thought too deeply about how to expose this.
const dynamicRegistry: IChannelFactory[] = [
	SharedDirectory.getFactory(),
	SharedString.getFactory(),
];

class MigrationDataStoreFactoryRegistry implements IFluidDataStoreRegistry {
	public get IFluidDataStoreRegistry() {
		return this;
	}

	constructor(private readonly registry: IFluidDataStoreRegistry) {}

	public async get(name: string): Promise<FluidDataStoreRegistryEntry | undefined> {
		const entry = await this.registry.get(name);
		if (entry === undefined) {
			return entry;
		}

		return getPureDataStoreRegistryEntry(entry);
	}
}

class MigrationDataStoreFactory extends DataObjectFactory<MigrationDataObject> {
	public get IFluidDataStoreFactory() {
		return this;
	}

	constructor(public readonly type: string) {
		super(type, MigrationDataObject, dynamicRegistry, []);
	}
}

// Copied from dataStoreContext.ts
interface ISnapshotDetails {
	pkg: readonly string[];
	isRootDataStore: boolean;
	snapshot?: ISnapshotTree;
}

interface IModifiableFluidDataStoreContext {
	pkg?: readonly string[];
	getInitialSnapshotDetails(): Promise<ISnapshotDetails>;
}

// There's a vein of thought to put the migration code here, where it extends the MigrationDataObject.
// Another thought is to party on the whole document. We'll need both solutions, so this is one way of doing it.
class MigrationDataObject extends DataObject {
	public get _root() {
		return this.root;
	}

	// Not sure if this is the right place for it, but might work
	public changeType(pkg: readonly string[]) {
		const context = this.context as unknown as IModifiableFluidDataStoreContext;
		context.pkg = pkg;
	}

	// Further improvements: Add delete/replace dds functionality
}

const defaultDataStoreId = "default";

class MigrationContainerRuntimeFactory extends BaseContainerRuntimeFactory {
	/**
	 * Constructor
	 * @param defaultFactory -
	 * @param registryEntries -
	 * @param dependencyContainer - deprecated, will be removed in a future release
	 * @param requestHandlers -
	 * @param runtimeOptions -
	 * @param initializeEntryPoint -
	 */
	constructor(
		registryEntries: NamedFluidDataStoreRegistryEntries,
		runtimeOptions?: IContainerRuntimeOptions,
		requestHandlers: RuntimeRequestHandler[] = [],
		initializeEntryPoint?: (runtime: IContainerRuntime) => Promise<FluidObject>,
	) {
		const newRegistryEntries: NamedFluidDataStoreRegistryEntry[] = [];
		for (const entry of registryEntries) {
			newRegistryEntries.push([entry[0], getMigrationRegistryEntryAsync(entry[1])]);
		}

		super(
			newRegistryEntries,
			undefined, // dependency container, skipping this
			[defaultRouteRequestHandler(defaultDataStoreId), ...requestHandlers],
			runtimeOptions,
			initializeEntryPoint,
		);
	}
}

function getPureDataStoreRegistryEntry(
	entry: FluidDataStoreRegistryEntry,
): FluidDataStoreRegistryEntry {
	const registry = entry.IFluidDataStoreRegistry;
	const factory = entry.IFluidDataStoreFactory;
	return {
		IFluidDataStoreRegistry:
			registry === undefined ? undefined : new MigrationDataStoreFactoryRegistry(registry),
		IFluidDataStoreFactory:
			factory === undefined ? undefined : new MigrationDataStoreFactory(factory.type),
	};
}

async function getMigrationRegistryEntryAsync(entry: Promise<FluidDataStoreRegistryEntry>) {
	return getPureDataStoreRegistryEntry(await entry);
}

// This api needs to be adjusted. Not sure exactly what the right one looks like.
class MigrationContainerRuntimeFactoryWithDefaultDataStore extends RuntimeFactoryHelper {
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
	private readonly pureContainerRuntimeFactory: MigrationContainerRuntimeFactory;
	private runtimeFactory: BaseContainerRuntimeFactory;

	constructor(
		private readonly runtimeFactoryV2: ContainerRuntimeFactoryWithDefaultDataStore,
		registryEntries: NamedFluidDataStoreRegistryEntries,
		runtimeOptions: IContainerRuntimeOptions,
	) {
		super();
		this.pureContainerRuntimeFactory = new MigrationContainerRuntimeFactory(
			registryEntries,
			runtimeOptions,
		);
		this.runtimeFactory = runtimeFactoryV2;
	}
	public async preInitialize(
		context: IContainerContext,
		existing: boolean,
	): Promise<ContainerRuntime> {
		this.clientDetailsType = context.clientDetails.type;
		if (this.clientDetailsType === summarizerClientType) {
			const migrationContext = new MigrationContainerContext(context);
			this.runtimeFactory = this.pureContainerRuntimeFactory;
			const runtime = await this.runtimeFactory.preInitialize(migrationContext, existing);
			migrationContext.setRuntime(runtime);
			return runtime;
		}

		return this.runtimeFactory.preInitialize(context, existing);
	}

	public async instantiateFirstTime(runtime: ContainerRuntime): Promise<void> {
		return this.runtimeFactory.instantiateFirstTime(runtime);
	}

	public async instantiateFromExisting(runtime: ContainerRuntime): Promise<void> {
		return this.runtimeFactory.instantiateFromExisting(runtime);
	}

	public async hasInitialized(runtime: ContainerRuntime): Promise<void> {
		await this.runtimeFactory.hasInitialized(runtime);
		if (this.clientDetailsType === summarizerClientType) {
			this.waitForSummarizerCreation.resolve(runtime);
			this.runtimeFactory = this.runtimeFactoryV2;
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
	public get dataStoreContext() {
		return this.context;
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

	public modifyData(value: string) {
		const array: string[] = [];
		for (let i = 0; i < scripts; i++) {
			this.root.set(`${i}`, value);
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

	const registryV1: NamedFluidDataStoreRegistryEntries = [
		[rootDOFactoryV1.type, Promise.resolve(rootDOFactoryV1)],
		[scriptDOFactory.type, Promise.resolve(scriptDOFactory)],
	];
	const registryV2: NamedFluidDataStoreRegistryEntries = [
		[rootDOFactoryV1.type, Promise.resolve(rootDOFactoryV1)],
		[rootDOFactoryV2.type, Promise.resolve(rootDOFactoryV2)],
		[scriptDOFactory.type, Promise.resolve(scriptDOFactory)],
	];

	const runtimeFactoryV1 = new ContainerRuntimeFactoryWithDefaultDataStore(
		rootDOFactoryV1,
		registryV1,
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	const runtimeFactoryV2 = new ContainerRuntimeFactoryWithDefaultDataStore(
		rootDOFactoryV2,
		registryV2,
		undefined,
		undefined,
		summaryRuntimeOptions,
	);

	const migrationRuntimeFactory = new MigrationContainerRuntimeFactoryWithDefaultDataStore(
		runtimeFactoryV2,
		registryV2,
		summaryRuntimeOptions,
	);

	beforeEach(() => {
		provider = getTestObjectProvider();
	});

	it("Can migrate with ContainerRuntimeFactory with just summarizer", async () => {
		// v1 container
		const c1 = await provider.createContainer(runtimeFactoryV1);
		const do1 = await requestFluidObject<RootDOV1>(c1, "/");
		const datastore1 = await do1.containerRuntime.createDataStore(rootDOFactoryV1.type);
		await datastore1.trySetAlias("unchanged");
		// Note this op and summary was sent so we don't hit assert 0x251.
		do1.rootDDS.set("some", "op");
		await waitForSummarizeAck(c1);
		await provider.ensureSynchronized();
		c1.close();

		// this test skips detecting that data migration needs to occur.
		// That was already proven in the previous part, it's not worth figuring out as that part is relatively easy.

		// This gets the summarizer with the conversion code.
		// Specifically haven't spent time on figuring out how I would get the summarization runtime as that's relatively trivial.
		const c2 = await provider.loadContainer(migrationRuntimeFactory);
		await waitForContainerConnection(c2);
		const do2 = await requestFluidObject<RootDOV1>(c2, "/");
		do2.rootDDS.set("another", "op");
		(migrationRuntimeFactory.interactiveRuntime as any).summaryManager.forceSummarization();
		const scr3 = await migrationRuntimeFactory.summarizerRuntime;

		// Grab the id of the unchanged data object to do incremental summary verification.
		const unchangedHandle3 = await scr3.getAliasedDataStoreEntryPoint("unchanged");
		assert(unchangedHandle3 !== undefined, "should be able to get the handle");
		const unchangedDO3 = (await unchangedHandle3.get()) as IFluidDataStoreRuntime;
		const unchangedId = unchangedDO3.id;

		// Note, needed to turn on migration mode to avoid 0x173 (I have no idea why, wasn't worth investigating)
		// The turning on of the migration api should be changed here as this is a prototype.
		const migrationContext = scr3.context as MigrationContainerContext;

		// This could be re-used for transactions now that I think about it.
		// Turning migration on and off can be done via submitting and processing an op, I've skipped that part here
		migrationContext.migrationOn = true;
		// Record the last known deltaManager sequence number for verification purposes.
		const lastKnownNumber = scr3.deltaManager.lastSequenceNumber;

		// Conversion code
		const do3Handle = await scr3.getAliasedDataStoreEntryPoint("default");
		assert(do3Handle !== undefined, "should be able to get the old runtime handle");
		const do3 = (await do3Handle.get()) as MigrationDataObject;

		for (let i = 0; i < scripts; i++) {
			const key = `${i}`;
			const scriptDO = await do3._root.get<IFluidHandle<MigrationDataObject>>(key)?.get();
			assert(scriptDO !== undefined, "Script DO missing!");
			const scriptSharedString = await scriptDO._root
				.get<IFluidHandle<SharedString>>(sharedStringKey)
				?.get();
			assert(scriptSharedString !== undefined, "Script shared string missing!");
			do3._root.set(key, scriptSharedString.getText());
		}
		do3.changeType([rootDOFactoryV2.type]);

		// End of conversion code
		// Learning note: calling addedGCOutboundReference might be useful in cases we want to do create new DOs and reference them.
		// I needed this to send out all the ops so we are not in a partial batch state when summarizing. Otherwise we assert
		(scr3 as any).flush();
		// This makes the runtime process all the local ops it sent.
		migrationContext.process();

		// First sequence number check. I'm not sure I'm asserting on the right numbers here
		assert(
			lastKnownNumber === scr3.deltaManager.lastSequenceNumber,
			"No sequence numbers should have been processed by the delta manager.",
		);

		// submit the summary and then turn off the migration, maybe close the summarizer, doesn't really matter.
		assert(scr3.getEntryPoint !== undefined, "should have a summarizer entry point");
		const summarizer = await scr3.getEntryPoint();
		assert(summarizer !== undefined, "summarizer should exist");
		const { summaryTree, summaryRefSeq, summaryVersion } = await summarizeNow(
			summarizer as ISummarizer,
		);
		// Incremental summary check
		const datastoresTree = summaryTree.tree[".channels"];
		assert(datastoresTree.type === SummaryType.Tree, "sdo3 should be summarized!");
		const do3Tree = datastoresTree.tree[do3.id];
		assert(do3Tree.type === SummaryType.Tree, "Expected tree!");
		const do3ComponentBlob = do3Tree.tree[".component"];
		assert(do3ComponentBlob.type === SummaryType.Blob, "expected a component blob");
		const do3Attributes = JSON.parse(do3ComponentBlob.content as string);
		assert(do3Attributes.pkg[0] === rootType2, "Package change to rootType2!");
		assert(
			datastoresTree.tree[unchangedId].type === SummaryType.Handle,
			"Expected summary handle!",
		);
		// second sequence number check
		assert.equal(
			lastKnownNumber,
			summaryRefSeq,
			"lastKnownNumber before migration should match the summary sequence number!",
		);
		(scr3.context as any).migrateOn = false;

		// validation that we can load the container in the v2 state
		const c4 = await provider.loadContainer(runtimeFactoryV2, undefined, {
			headers: { [LoaderHeader.version]: summaryVersion },
		});
		const do4 = await requestFluidObject<RootDOV2>(c4, "/");
		for (const data of do4.data) {
			assert(data === "abc", "should be properly set");
		}
		assert(do4.data.length === scripts, `Should have ${scripts} not ${do4.data.length}`);

		// v2 can send ops
		do4.rootDDS.set("any", "op");
		do4.modifyData("xyz");
		await provider.ensureSynchronized();
		for (const data of do4.data) {
			assert(data === "xyz", "should be properly set");
		}
	});
});
