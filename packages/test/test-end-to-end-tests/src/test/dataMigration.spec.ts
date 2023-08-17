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
import { SharedDirectory } from "@fluidframework/map";
import {
	ContainerRuntime,
	DefaultSummaryConfiguration,
	IContainerRuntimeOptions,
	ISummarizer,
	summarizerClientType,
} from "@fluidframework/container-runtime";
import { RuntimeFactoryHelper, requestFluidObject } from "@fluidframework/runtime-utils";
import { IDocumentStorageService } from "@fluidframework/driver-definitions";
import { FluidObject, IFluidHandle, ITelemetryBaseLogger } from "@fluidframework/core-interfaces";
import { Deferred } from "@fluidframework/common-utils";
import { IChannelFactory, IFluidDataStoreRuntime } from "@fluidframework/datastore-definitions";
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

/**
 * At the top level we are using the ContainerRuntimeFactoryManager which utilizes both the regular containerRuntimeFactory
 * as well as a special containerRuntimeFactory (MigrationContainerRuntimeFactory) takes the regular registry and replaces all
 * the factories with the MigrationDataObjectFactory. It also creates a MigrationContainerContext adapter and passes that
 * to the new ContainerRuntime.
 *
 * The ContainerRuntimeFactoryManager detects when it's a summarizer client - we need to add logic to detect we are opening a v1
 * form of the document, and loads the summarizer with the MigrationContainerRuntimeFactory.
 *
 * This makes sure all the dataObjects we load are MigrationDataObjects, which we control. Our customers can take this and extend
 * or use it generically. I think we should leave it up to them.
 *
 * They then would make the changes on the summarizer client, maybe via op or something, not exactly sure. I think the main client
 * should be the one to send the op, but that's a small detail. In my opinion I think the main client can do detection as that
 * runtime already is established and it can communicate back to the runtime factory to tell it to create a migration summarizer.
 *
 * A thought I'm concerned about is that the search blob can disappear for all dataObjects that are modified, though search will
 * resume on the next summarization (probably).
 *
 * The migration itself is rather simple, we turn on migration on the context, we get our data object we care about, migrate it and
 * then we submit a summary, turn off migration, and load a new container. Interesting fact, the migrationDataObject can process ops
 * as well without necessarily doing anything special.
 */

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
	readonly id: string = this.context.id;
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

// Replaces a regular registry with a Migration registry
class MigrationDataObjectFactoryRegistry implements IFluidDataStoreRegistry {
	public get IFluidDataStoreRegistry() {
		return this;
	}

	constructor(private readonly registry: IFluidDataStoreRegistry) {}

	public async get(name: string): Promise<FluidDataStoreRegistryEntry | undefined> {
		const entry = await this.registry.get(name);
		if (entry === undefined) {
			return entry;
		}

		return getMigrationDataStoreRegistryEntry(entry);
	}
}

// I don't think I need to do this, but this works.
class MigrationDataObjectFactory extends DataObjectFactory<MigrationDataObject> {
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

// Not sure how/if we should change the FluidDataStoreContext
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

// Copied from containerRuntimeFactoryWithDefaultDataStore.ts
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

function getMigrationDataStoreRegistryEntry(
	entry: FluidDataStoreRegistryEntry,
): FluidDataStoreRegistryEntry {
	const registry = entry.IFluidDataStoreRegistry;
	const factory = entry.IFluidDataStoreFactory;
	return {
		IFluidDataStoreRegistry:
			registry === undefined ? undefined : new MigrationDataObjectFactoryRegistry(registry),
		IFluidDataStoreFactory:
			factory === undefined ? undefined : new MigrationDataObjectFactory(factory.type),
	};
}

async function getMigrationRegistryEntryAsync(entry: Promise<FluidDataStoreRegistryEntry>) {
	return getMigrationDataStoreRegistryEntry(await entry);
}

// This api needs to be adjusted. Not sure exactly what the right one looks like.
class ContainerRuntimeFactoryManager extends RuntimeFactoryHelper {
	private clientDetailsType?: string;
	private readonly waitForSummarizerCreation = new Deferred<ContainerRuntime>();
	private readonly waitForMigrationContext = new Deferred<MigrationContainerContext>();
	public get summarizerRuntime() {
		return this.waitForSummarizerCreation.promise;
	}

	public get migrationContext() {
		return this.waitForMigrationContext.promise;
	}
	private _interactiveRuntime?: ContainerRuntime;
	public get interactiveRuntime() {
		assert(this._interactiveRuntime !== undefined);
		return this._interactiveRuntime;
	}
	private readonly migrationContainerRuntimeFactory: MigrationContainerRuntimeFactory;
	private runtimeFactory: BaseContainerRuntimeFactory;

	constructor(
		private readonly runtimeFactoryV2: ContainerRuntimeFactoryWithDefaultDataStore,
		registryEntries: NamedFluidDataStoreRegistryEntries,
		runtimeOptions: IContainerRuntimeOptions,
	) {
		super();
		this.migrationContainerRuntimeFactory = new MigrationContainerRuntimeFactory(
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
			this.runtimeFactory = this.migrationContainerRuntimeFactory;
			const runtime = await this.runtimeFactory.preInitialize(migrationContext, existing);
			migrationContext.setRuntime(runtime);
			this.waitForMigrationContext.resolve(migrationContext);
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

// The goal is to go from rootType1 to rootType2
const rootType1 = "rootType1";
const rootType2 = "rootType2";

// The number of "rows/columns" this is a lazy implementation
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

	const migrationRuntimeFactory = new ContainerRuntimeFactoryManager(
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
		const migrationContext = await migrationRuntimeFactory.migrationContext;

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
		migrationContext.migrationOn = false;

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
