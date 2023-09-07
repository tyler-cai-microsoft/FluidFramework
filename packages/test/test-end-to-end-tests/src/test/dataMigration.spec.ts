/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { describeNoCompat } from "@fluid-internal/test-version-utils";
import { IContainer, IContainerContext, LoaderHeader } from "@fluidframework/container-definitions";
import { ITestObjectProvider, waitForContainerConnection } from "@fluidframework/test-utils";
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
	ISummarizeResults,
} from "@fluidframework/container-runtime";
import { requestFluidObject } from "@fluidframework/runtime-utils";
import { FluidObject, IFluidHandle } from "@fluidframework/core-interfaces";
import { Deferred } from "@fluidframework/common-utils";
import { IFluidDataStoreRuntime } from "@fluidframework/datastore-definitions";
import {
	ISequencedDocumentMessage,
	ISummaryAck,
	MessageType,
	SummaryType,
} from "@fluidframework/protocol-definitions";
import { SharedString } from "@fluidframework/sequence";
import { NamedFluidDataStoreRegistryEntries } from "@fluidframework/runtime-definitions";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { RuntimeRequestHandler } from "@fluidframework/request-handler";
import {
	MigratorDataObject,
	IMigratorDetectorRuntimeFactory,
	ContainerRuntimeFactoryManager,
	MigratorFluidRuntimeFactory,
} from "@fluid-experimental/data-migration";

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

// customers determine how they will build their registry
// I don't think I need to do this, but this works.
class MigratorDataObjectFactory extends MigratorFluidRuntimeFactory {
	constructor(public readonly type: string) {
		super(type, MigratorDataObject, [SharedDirectory.getFactory(), SharedString.getFactory()]);
	}
}

// It's up to the customer how they want to detect and store version. I used a data object. Maybe we should do something else, but this allows us not to change our API surface.
const versionKey = "version";
const v2 = "v2";
class DetectorRuntimeFactory
	extends BaseContainerRuntimeFactory
	implements IMigratorDetectorRuntimeFactory
{
	private _shouldMigrate: boolean = false;
	public get shouldMigrate(): boolean {
		return this._shouldMigrate;
	}
	constructor(
		registryEntries: NamedFluidDataStoreRegistryEntries,
		runtimeOptions?: IContainerRuntimeOptions,
		requestHandlers: RuntimeRequestHandler[] = [],
		initializeEntryPoint?: (runtime: IContainerRuntime) => Promise<FluidObject>,
	) {
		super(
			registryEntries,
			undefined, // dependency container, skipping this
			[defaultRouteRequestHandler(defaultDataStoreId), ...requestHandlers],
			runtimeOptions,
			initializeEntryPoint,
		);
	}

	public async instantiateRuntime(
		context: IContainerContext,
		existing: boolean,
	): Promise<ContainerRuntime> {
		const runtime = await this.preInitialize(context, existing);
		await (existing
			? this.instantiateFromExisting(runtime)
			: this.instantiateFirstTime(runtime));
		await this.hasInitialized(runtime);
		return runtime;
	}

	public async hasInitialized(runtime: IContainerRuntime): Promise<void> {
		assert(
			runtime.getAliasedDataStoreEntryPoint !== undefined,
			"should be able to retrieve entry point",
		);
		const defaultHandle = await runtime.getAliasedDataStoreEntryPoint("default");
		const defaultObject = await defaultHandle?.get();
		assert(defaultObject !== undefined, "default should not be undefined");
		const defaultDataObject = defaultObject as MigratorDataObject;
		if (defaultDataObject._root.get(versionKey) !== v2) {
			this._shouldMigrate = true;
		}
	}
}

// Copied from containerRuntimeFactoryWithDefaultDataStore.ts
const defaultDataStoreId = "default";
// It's up to the customer to create the right factory for data migration that produces migrator data objects
class MigrationContainerRuntimeFactory extends BaseContainerRuntimeFactory {
	constructor(
		registryEntries: NamedFluidDataStoreRegistryEntries,
		runtimeOptions?: IContainerRuntimeOptions,
		requestHandlers: RuntimeRequestHandler[] = [],
		initializeEntryPoint?: (runtime: IContainerRuntime) => Promise<FluidObject>,
	) {
		super(
			registryEntries,
			undefined, // dependency container, skipping this
			[defaultRouteRequestHandler(defaultDataStoreId), ...requestHandlers],
			runtimeOptions,
			initializeEntryPoint,
		);
	}

	public async instantiateRuntime(
		context: IContainerContext,
		existing: boolean,
	): Promise<ContainerRuntime> {
		const runtime = await this.preInitialize(context, existing);
		await (existing
			? this.instantiateFromExisting(runtime)
			: this.instantiateFirstTime(runtime));
		await this.hasInitialized(runtime);
		return runtime;
	}
}

// ScriptDO is the example "nested component"
// RootDOV1 is the v1 "parent component"
// RootDOV2 is the v2 "parent component"
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

const ddsKey = "ddsKey";
const ddsEntryKey = "key";
const ddsEntryValue = "value";

// The number of "rows/columns" this is a lazy implementation
const scriptDOCount = 3;
class RootDOV1 extends DataObject {
	public get containerRuntime() {
		return this.context.containerRuntime as ContainerRuntime;
	}
	public get _root() {
		return this.root;
	}
	public get dataStoreContext() {
		return this.context;
	}

	protected async initializingFirstTime(props?: any): Promise<void> {
		for (let i = 0; i < scriptDOCount; i++) {
			const ds = await this.containerRuntime.createDataStore(scriptType);
			const fluidObject = await ds.entryPoint?.get();
			assert(fluidObject !== undefined, "should have created a data object");
			const scriptDO = fluidObject as ScriptDO;
			this.root.set(`${i}`, scriptDO.handle);
		}

		const sharedString = SharedString.create(this.runtime);
		this.root.set(ddsKey, sharedString.handle);
		sharedString.insertText(0, `${ddsEntryKey}:${ddsEntryValue}`);
	}
}

class RootDOV2 extends DataObject {
	public get containerRuntime() {
		return this.context.containerRuntime as ContainerRuntime;
	}
	public get _root() {
		return this.root;
	}

	public async getReplacedDDS() {
		const handle = this.root.get<IFluidHandle<SharedDirectory>>(ddsKey);
		const directory = await handle?.get();
		assert(directory !== undefined, "should be able to get directory from handle");
		return directory;
	}

	public get data() {
		const array: string[] = [];
		for (let i = 0; i < scriptDOCount; i++) {
			const data = this.root.get<string>(`${i}`);
			assert(data !== undefined, "Data should have been stored");
			array.push(data);
		}
		return array;
	}

	public modifyData(value: string) {
		const array: string[] = [];
		for (let i = 0; i < scriptDOCount; i++) {
			this.root.set(`${i}`, value);
		}
		return array;
	}

	protected async initializingFirstTime(props?: any): Promise<void> {
		for (let i = 0; i < scriptDOCount; i++) {
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
	const rootDOFactoryV1 = new DataObjectFactory(
		rootType1,
		RootDOV1,
		[SharedString.getFactory()],
		[],
	);
	const rootDOFactoryV2 = new DataObjectFactory(rootType2, RootDOV2, [], []);

	const registryV1: NamedFluidDataStoreRegistryEntries = [
		[rootType1, Promise.resolve(rootDOFactoryV1)],
		[scriptType, Promise.resolve(scriptDOFactory)],
	];
	const registryV2: NamedFluidDataStoreRegistryEntries = [
		[rootType1, Promise.resolve(rootDOFactoryV1)],
		[rootType2, Promise.resolve(rootDOFactoryV2)],
		[scriptType, Promise.resolve(scriptDOFactory)],
	];
	const migrationRegistry: NamedFluidDataStoreRegistryEntries = [
		[rootType1, Promise.resolve(new MigratorDataObjectFactory(rootType1))],
		[rootType2, Promise.resolve(new MigratorDataObjectFactory(rootType2))],
		[scriptType, Promise.resolve(new MigratorDataObjectFactory(scriptType))],
	];

	const runtimeFactoryV1 = new ContainerRuntimeFactoryWithDefaultDataStore(
		rootDOFactoryV1,
		registryV1,
		undefined,
		undefined,
		defaultRuntimeOptions,
	);

	// I used MigrationContainerRuntimeFactory for compilation reasons
	const runtimeFactoryV2 = new DetectorRuntimeFactory(registryV2, summaryRuntimeOptions);

	const migrationContainerRuntimeFactory = new MigrationContainerRuntimeFactory(
		migrationRegistry,
		summaryRuntimeOptions,
	);

	const createContainerV1 = async () => {
		const container = await provider.createContainer(runtimeFactoryV1);
		const rootDataObject = await requestFluidObject<RootDOV1>(container, "/");
		const unchangedDataStore = await rootDataObject.containerRuntime.createDataStore(
			rootDOFactoryV1.type,
		);
		await unchangedDataStore.trySetAlias("unchanged");
		// Note this op and summary was sent so we don't hit assert 0x251.
		rootDataObject._root.set("some", "op");
		await waitForSummarizeAck(container);
		await provider.ensureSynchronized();
		container.close();
	};

	// Learning note: calling addedGCOutboundReference might be useful in cases we want to do create new DOs and reference them.
	const makeLocalMigrationChanges = async (containerRuntime: ContainerRuntime) => {
		const rootDataObjectHandle = await containerRuntime.getAliasedDataStoreEntryPoint(
			"default",
		);
		assert(rootDataObjectHandle !== undefined, "should be able to get the old runtime handle");
		const rootDataObject = (await rootDataObjectHandle.get()) as MigratorDataObject;

		for (let i = 0; i < scriptDOCount; i++) {
			const key = `${i}`;
			const scriptDO = await rootDataObject._root
				.get<IFluidHandle<MigratorDataObject>>(key)
				?.get();
			assert(scriptDO !== undefined, "Script DO missing!");
			const scriptSharedString = await scriptDO._root
				.get<IFluidHandle<SharedString>>(sharedStringKey)
				?.get();
			assert(scriptSharedString !== undefined, "Script shared string missing!");
			rootDataObject._root.set(key, scriptSharedString.getText());
		}

		const sharedStringHandle = rootDataObject._root.get<IFluidHandle<SharedString>>(ddsKey);
		const sharedString = await sharedStringHandle?.get();
		assert(sharedString !== undefined, "shared string not stored in v1 root data object!");
		const newChannel = await rootDataObject.replaceChannel(
			sharedString,
			SharedDirectory.getFactory(),
		);
		const sharedDirectory = newChannel as SharedDirectory;
		const [newKey, newValue] = sharedString.getText().split(":");
		sharedDirectory.set(newKey, newValue);

		// Changes the data object type
		rootDataObject.changeType([rootType2]);

		// Note that we are now v2, it's up to the customer how they want to do it.
		rootDataObject._root.set(versionKey, v2);
	};

	const validateDocumentIsV2Format = async (v2SummaryVersion: string) => {
		await provider.ensureSynchronized();
		const container = await provider.loadContainer(runtimeFactoryV2, undefined, {
			headers: { [LoaderHeader.version]: v2SummaryVersion },
		});
		// The root data object should be v2 now
		const rootDataObject = await requestFluidObject<RootDOV2>(container, "/");
		for (const data of rootDataObject.data) {
			assert(data === "abc", "should be properly set");
		}
		assert(rootDataObject._root.get("some") === "op", "first op lost!");
		assert(
			rootDataObject.data.length === scriptDOCount,
			`Should have ${scriptDOCount} not ${rootDataObject.data.length}`,
		);

		const dds = await rootDataObject.getReplacedDDS();
		const actualValue = dds.get(ddsEntryKey);
		assert(actualValue === ddsEntryValue, `${actualValue} expected to be ${ddsEntryValue}`);

		rootDataObject._root.set("any", "op");
		rootDataObject.modifyData("xyz");
		await provider.ensureSynchronized();
		// Something cool to note, the summarizer client isn't closed, but it's able to process the data
		// We still want to reload the summarizer client for search purposes.
		for (const data of rootDataObject.data) {
			assert(data === "xyz", "should be properly set");
		}
	};

	const getSummarizeNowResults = async (summarizeResult: ISummarizeResults) => {
		const submitResult = await summarizeResult.summarySubmitted;
		const ackOrNackResult = await summarizeResult.receivedSummaryAckOrNack;
		assert(submitResult.success, "should have submitted");
		assert(ackOrNackResult.success, "should have acked or nacked!");
		assert(
			submitResult.data.stage === "submit",
			"on-demand summary submitted data stage should be submit",
		);

		const summaryTree = submitResult.data.summaryTree;
		const summaryVersion = ackOrNackResult.data.summaryAckOp.contents.handle;
		const summaryRefSeq = submitResult.data.referenceSequenceNumber;
		return { summaryTree, summaryVersion, summaryRefSeq };
	};

	let migrationRuntimeFactory: ContainerRuntimeFactoryManager =
		new ContainerRuntimeFactoryManager(runtimeFactoryV2, migrationContainerRuntimeFactory);
	beforeEach(() => {
		provider = getTestObjectProvider();
		migrationRuntimeFactory = new ContainerRuntimeFactoryManager(
			runtimeFactoryV2,
			migrationContainerRuntimeFactory,
		);
	});

	it("Can migrate with ContainerRuntimeFactory with just summarizer", async () => {
		await createContainerV1();

		// Load v1.5 migration code
		const containerV1ToV2 = await provider.loadContainer(migrationRuntimeFactory);
		await waitForContainerConnection(containerV1ToV2);
		const rootDataObject = await requestFluidObject<RootDOV1>(containerV1ToV2, "/");

		// Start migration by submitting the migration op
		rootDataObject.containerRuntime.submitMigrateOp();

		// Get the migration tools from the migration factory
		const summarizerContainerRuntime3 = await migrationRuntimeFactory.summarizerRuntime;
		const migrationContext = await migrationRuntimeFactory.migrationContext;
		// maybe this should be baked in the above promises
		await migrationContext.waitForProposalAcceptance;

		// Conversion code - this can be put in the migration data object, be a separate function, it's up to the customer
		await makeLocalMigrationChanges(summarizerContainerRuntime3);

		// The summarizer will process all the changes and submit a summary
		const summarizeResult: ISummarizeResults = await migrationContext.submitMigrationSummary();
		const { summaryVersion: v2SummaryVersion } = await getSummarizeNowResults(summarizeResult);

		// load the new container from the new summary
		await validateDocumentIsV2Format(v2SummaryVersion);
	});

	it("Can migrate with ContainerRuntimeFactory without changing sequence numbers", async () => {
		await createContainerV1();

		// Load v1.5 migration code
		const containerV1ToV2 = await provider.loadContainer(migrationRuntimeFactory);
		await waitForContainerConnection(containerV1ToV2);
		const rootDataObject = await requestFluidObject<RootDOV1>(containerV1ToV2, "/");

		// Start migration by submitting the migration op
		rootDataObject.containerRuntime.submitMigrateOp();

		// Get the migration tools from the migration factory
		const summarizerContainerRuntime = await migrationRuntimeFactory.summarizerRuntime;
		const migrationContext = await migrationRuntimeFactory.migrationContext;
		// maybe this should be baked in the above promises
		await migrationContext.waitForProposalAcceptance;

		// Record the last known deltaManager sequence number for verification purposes.
		const startSeqNum = summarizerContainerRuntime.deltaManager.lastSequenceNumber;

		// Conversion code - this can be put in the migration data object, be a separate function, it's up to the customer
		await makeLocalMigrationChanges(summarizerContainerRuntime);

		// The summarizer will process all the changes and submit a summary
		const summarizeResult: ISummarizeResults = await migrationContext.submitMigrationSummary();
		const { summaryVersion: v2SummaryVersion, summaryRefSeq } = await getSummarizeNowResults(
			summarizeResult,
		);

		assert(startSeqNum === summaryRefSeq, "Ref seq num should equal the start seq num!");

		// load the new container from the new summary
		await validateDocumentIsV2Format(v2SummaryVersion);
	});

	it("Can migrate and incrementally summarize", async () => {
		await createContainerV1();

		// Load v1.5 migration code
		const containerV1ToV2 = await provider.loadContainer(migrationRuntimeFactory);
		await waitForContainerConnection(containerV1ToV2);
		const rootDataObject = await requestFluidObject<RootDOV1>(containerV1ToV2, "/");

		// Grab the id of the unchanged data object to do incremental summary verification.
		const unchangedDataObjectHandle =
			await rootDataObject.containerRuntime.getAliasedDataStoreEntryPoint("unchanged");
		assert(unchangedDataObjectHandle !== undefined, "should be able to get the handle");
		const unchangedDataObject =
			(await unchangedDataObjectHandle.get()) as IFluidDataStoreRuntime;

		// Start migration by submitting the migration op
		rootDataObject.containerRuntime.submitMigrateOp();

		// Get the migration tools from the migration factory
		const summarizerContainerRuntime = await migrationRuntimeFactory.summarizerRuntime;
		const migrationContext = await migrationRuntimeFactory.migrationContext;
		// maybe this should be baked in the above promises
		await migrationContext.waitForProposalAcceptance;

		// Conversion code - this can be put in the migration data object, be a separate function, it's up to the customer
		await makeLocalMigrationChanges(summarizerContainerRuntime);

		// The summarizer will process all the changes and submit a summary
		const summarizeResult: ISummarizeResults = await migrationContext.submitMigrationSummary();
		const { summaryVersion: v2SummaryVersion, summaryTree } = await getSummarizeNowResults(
			summarizeResult,
		);

		// Incremental summary check
		const datastoresTree = summaryTree.tree[".channels"];
		assert(datastoresTree.type === SummaryType.Tree, "sdo3 should be summarized!");
		const rootDataObjectTree = datastoresTree.tree[rootDataObject.id];
		assert(rootDataObjectTree.type === SummaryType.Tree, "Expected tree!");
		const unchangedDataObjectTree = datastoresTree.tree[unchangedDataObject.id];
		assert(unchangedDataObjectTree.type === SummaryType.Handle, "Expected summary handle!");

		// load the new container from the new summary
		await validateDocumentIsV2Format(v2SummaryVersion);
	});

	it("During migration, clients don't send remote ops, v1 containers are closed", async () => {
		await createContainerV1();

		// Load v1.5 migration code
		const container1 = await provider.loadContainer(migrationRuntimeFactory);
		await waitForContainerConnection(container1);
		const rootDataObject = await requestFluidObject<RootDOV1>(container1, "/");

		// Create another container that would be another client to prove that ops can't be submitted and that it will close once migration completes
		const container2 = await provider.loadContainer(migrationRuntimeFactory);
		const rootDataObject2 = await requestFluidObject<RootDOV1>(container2, "/");

		rootDataObject.containerRuntime.submitMigrateOp();

		// Get the migration tools from the migration factory
		const summarizerContainerRuntime = await migrationRuntimeFactory.summarizerRuntime;
		const migrationContext = await migrationRuntimeFactory.migrationContext;
		// maybe this should be baked in the above promises
		await migrationContext.waitForProposalAcceptance;

		// This op should not make it onto the op stream.
		rootDataObject2._root.set("shouldnot", "send this op");
		await makeLocalMigrationChanges(summarizerContainerRuntime);

		const summarizeResult: ISummarizeResults = await migrationContext.submitMigrationSummary();
		const { summaryVersion: v2SummaryVersion, summaryTree } = await getSummarizeNowResults(
			summarizeResult,
		);

		await provider.ensureSynchronized();
		assert(container2.closed, "Container 2 should have closed as it was in v1");

		// container 3 is in v2
		const container3 = await provider.loadContainer(runtimeFactoryV2, undefined, {
			headers: { [LoaderHeader.version]: v2SummaryVersion },
		});
		const rootDataObject3 = await requestFluidObject<RootDOV2>(container3, "/");
		assert(rootDataObject3._root.get("shouldnot") === undefined, "op sent during migration!");
	});
});
