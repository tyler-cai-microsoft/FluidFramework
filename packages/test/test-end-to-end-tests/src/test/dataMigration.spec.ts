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
	ContainerRuntimeFactoryManager,
	IMigratorDetectorRuntimeFactory,
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
class MigratorDataObjectFactory extends DataObjectFactory<MigratorDataObject> {
	public get IFluidDataStoreFactory() {
		return this;
	}

	constructor(public readonly type: string) {
		super(
			type,
			MigratorDataObject,
			[SharedDirectory.getFactory(), SharedString.getFactory()],
			[],
		);
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
	}
}

class RootDOV2 extends DataObject {
	public get containerRuntime() {
		return this.context.containerRuntime as ContainerRuntime;
	}
	public get _root() {
		return this.root;
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
	const rootDOFactoryV1 = new DataObjectFactory(rootType1, RootDOV1, [], []);
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

	// I am passing v2 here as it has registry info for both v1 and v2.
	const migrationRuntimeFactory = new ContainerRuntimeFactoryManager(
		runtimeFactoryV2,
		migrationContainerRuntimeFactory,
	);

	beforeEach(() => {
		provider = getTestObjectProvider();
	});

	it("Can migrate with ContainerRuntimeFactory with just summarizer", async () => {
		// v1 container
		const container1 = await provider.createContainer(runtimeFactoryV1);
		const rootDataObject1 = await requestFluidObject<RootDOV1>(container1, "/");
		const datastore1 = await rootDataObject1.containerRuntime.createDataStore(
			rootDOFactoryV1.type,
		);
		await datastore1.trySetAlias("unchanged");
		// Note this op and summary was sent so we don't hit assert 0x251.
		rootDataObject1._root.set("some", "op");
		await waitForSummarizeAck(container1);
		await provider.ensureSynchronized();
		container1.close();

		// this test skips detecting that data migration needs to occur.
		// That was already proven in the previous part, it's not worth figuring out as that part is relatively easy.

		// This gets the summarizer with the conversion code.
		// Specifically haven't spent time on figuring out how I would get the summarization runtime as that's relatively trivial.
		const container2 = await provider.loadContainer(migrationRuntimeFactory);
		await waitForContainerConnection(container2);
		const rootDataObject2 = await requestFluidObject<RootDOV1>(container2, "/");
		rootDataObject2._root.set("another", "op");
		(rootDataObject2.containerRuntime as any).summaryManager.forceSummarization();
		const summarizerContainerRuntime3 = await migrationRuntimeFactory.summarizerRuntime;

		// Create 4th container that would be another client to prove that ops can't be submitted and that it will close once migration completes
		const container4 = await provider.loadContainer(migrationRuntimeFactory);
		const dataObject4 = await requestFluidObject<RootDOV1>(container4, "/");

		// Grab the id of the unchanged data object to do incremental summary verification.
		const unchangedHandle3 = await summarizerContainerRuntime3.getAliasedDataStoreEntryPoint(
			"unchanged",
		);
		assert(unchangedHandle3 !== undefined, "should be able to get the handle");
		const unchangedDataObject3 = (await unchangedHandle3.get()) as IFluidDataStoreRuntime;
		const unchangedId = unchangedDataObject3.id;

		// Note, needed to turn on migration mode to avoid 0x173 (I have no idea why, wasn't worth investigating)
		// The turning on of the migration api should be changed here as this is a prototype.
		const migrationContext = await migrationRuntimeFactory.migrationContext;

		// This could be re-used for transactions now that I think about it.
		// Turning migration on and off can be done via submitting and processing an op, I've skipped that part here
		await migrationContext.startMigration();
		// Record the last known deltaManager sequence number for verification purposes.
		const preMigrationSequenceNumber =
			summarizerContainerRuntime3.deltaManager.lastSequenceNumber;

		// Conversion code
		const rootDataObject3Handle =
			await summarizerContainerRuntime3.getAliasedDataStoreEntryPoint("default");
		assert(rootDataObject3Handle !== undefined, "should be able to get the old runtime handle");
		const dataObject3 = (await rootDataObject3Handle.get()) as MigratorDataObject;

		for (let i = 0; i < scriptDOCount; i++) {
			const key = `${i}`;
			const scriptDO = await dataObject3._root
				.get<IFluidHandle<MigratorDataObject>>(key)
				?.get();
			assert(scriptDO !== undefined, "Script DO missing!");
			const scriptSharedString = await scriptDO._root
				.get<IFluidHandle<SharedString>>(sharedStringKey)
				?.get();
			assert(scriptSharedString !== undefined, "Script shared string missing!");
			dataObject3._root.set(key, scriptSharedString.getText());
		}
		dataObject3.changeType([rootType2]);
		dataObject3._root.set(versionKey, v2);

		// This op should not make it onto the op stream.
		dataObject4._root.set("shouldnot", "send this op");

		// End of conversion code
		// Learning note: calling addedGCOutboundReference might be useful in cases we want to do create new DOs and reference them.
		// This makes the runtime process all the local ops it sent.
		const summarizeResult: ISummarizeResults = await migrationContext.submitMigrationSummary();

		// Start of validation
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

		// Incremental summary check
		const datastoresTree = summaryTree.tree[".channels"];
		assert(datastoresTree.type === SummaryType.Tree, "sdo3 should be summarized!");
		const rootDataObjectTree = datastoresTree.tree[dataObject3.id];
		assert(rootDataObjectTree.type === SummaryType.Tree, "Expected tree!");
		assert(
			datastoresTree.tree[unchangedId].type === SummaryType.Handle,
			"Expected summary handle!",
		);
		// reference sequence number check
		assert.equal(
			preMigrationSequenceNumber,
			summaryRefSeq,
			"lastKnownNumber before migration should match the summary sequence number!",
		);

		await provider.ensureSynchronized();
		assert(container4.closed, "Container 4 should have closed as it was in v1");

		// validation that we can load the container in the v2 state
		const container5 = await provider.loadContainer(runtimeFactoryV2, undefined, {
			headers: { [LoaderHeader.version]: summaryVersion },
		});
		// The root data object should be v2 now
		const rootDataObject5 = await requestFluidObject<RootDOV2>(container5, "/");
		for (const data of rootDataObject5.data) {
			assert(data === "abc", "should be properly set");
		}
		assert(rootDataObject5._root.get("some") === "op", "first op lost!");
		assert(rootDataObject5._root.get("another") === "op", "second op lost!");
		assert(rootDataObject5._root.get("shouldnot") === undefined, "op sent during migration!");
		assert(
			rootDataObject5.data.length === scriptDOCount,
			`Should have ${scriptDOCount} not ${rootDataObject5.data.length}`,
		);

		// v2 can send ops
		rootDataObject5._root.set("any", "op");
		rootDataObject5.modifyData("xyz");
		await provider.ensureSynchronized();
		// Something cool to note, the summarizer client isn't closed, but it's able to process the data
		// We still want to reload the summarizer client for search purposes.
		for (const data of rootDataObject5.data) {
			assert(data === "xyz", "should be properly set");
		}
	});
});
