/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import {
	createTestConfigProvider,
	createSummarizer,
	ITestContainerConfig,
	ITestObjectProvider,
	summarizeNow,
	waitForContainerConnection,
} from "@fluidframework/test-utils";
import {
	describeCompat,
	ITestDataObject,
	TestDataObjectType,
} from "@fluid-private/test-version-utils";
import {
	ISummaryTree,
	SummaryType,
	type ISnapshotTree,
} from "@fluidframework/protocol-definitions";
import { IContainer, LoaderHeader } from "@fluidframework/container-definitions";
import type { ISnapshot } from "@fluidframework/driver-definitions";
import { getGCStateFromSummary } from "./gcTestSummaryUtils.js";

const interceptResult = <T>(
	parent: any,
	fn: (...args: any[]) => Promise<T>,
	intercept: (result: T) => void,
) => {
	const interceptFn = async (...args: any[]) => {
		const val = await fn.apply(parent, args);
		intercept(val);
		return val as T;
	};
	parent[fn.name] = interceptFn;
	interceptFn.bind(parent);
	return fn;
};

const assertOmittedTree = (
	snapshotTree: ISnapshotTree,
	groupId: string | undefined,
	message: string,
) => {
	assert(snapshotTree.omitted, message);
	assert(snapshotTree.groupId === groupId, message);
	assert(Object.entries(snapshotTree.trees).length === 0, message);
	assert(Object.entries(snapshotTree.blobs).length === 0, message);
};

/**
 * Validates that an unreferenced datastore goes through all the GC phases without overlapping.
 */
describeCompat("GC & Data Virtualization", "NoCompat", (getTestObjectProvider) => {
	const configProvider = createTestConfigProvider();
	configProvider.set("Fluid.Container.UseLoadingGroupIdForSnapshotFetch", true);
	const testContainerConfig: ITestContainerConfig = {
		runtimeOptions: {
			summaryOptions: {
				summaryConfigOverrides: {
					state: "disabled",
				},
			},
		},
		loaderProps: { configProvider },
	};

	let provider: ITestObjectProvider;

	const loadSummarizer = async (container: IContainer, summaryVersion?: string) => {
		return createSummarizer(
			provider,
			container,
			{
				loaderProps: { configProvider },
			},
			summaryVersion,
		);
	};

	function getDataStoreInSummaryTree(summaryTree: ISummaryTree, dataStoreId: string) {
		const channelsTree = summaryTree.tree[".channels"];
		assert(channelsTree !== undefined, "Expected a .channels tree");
		assert(channelsTree.type === SummaryType.Tree, "Expected a tree");
		return channelsTree.tree[dataStoreId];
	}

	async function isDataStoreInSummaryTree(summaryTree: ISummaryTree, dataStoreId: string) {
		return getDataStoreInSummaryTree(summaryTree, dataStoreId) !== undefined;
	}

	beforeEach("setup", async function () {
		provider = getTestObjectProvider({ syncSummarizer: true });

		// Data virtualization only works with local
		// TODO: enable for ODSP
		if (provider.driver.type !== "local") {
			this.skip();
		}
	});

	it("Virtualized datastore has same gc state even when not downloaded", async () => {
		// Intercept snapshot call so we can get call count and the snapshot
		let snapshotCaptured: ISnapshot | undefined;
		let callCount = 0;
		const documentServiceFactory = provider.documentServiceFactory;
		interceptResult(
			documentServiceFactory,
			documentServiceFactory.createDocumentService,
			(documentService) => {
				interceptResult(documentService, documentService.connectToStorage, (storage) => {
					assert(storage.getSnapshot !== undefined, "Test can't run without getSnapshot");
					interceptResult(storage, storage.getSnapshot, (snapshot) => {
						snapshotCaptured = snapshot;
						callCount++;
					});
				});
			},
		);

		const mainContainer = await provider.makeTestContainer(testContainerConfig);
		const mainDataStore = (await mainContainer.getEntryPoint()) as ITestDataObject;
		await waitForContainerConnection(mainContainer);

		const { container, summarizer } = await loadSummarizer(mainContainer);

		// create datastore
		const dataStoreA = await mainDataStore._context.containerRuntime.createDataStore(
			TestDataObjectType,
			"group",
		);
		const dataStoreB =
			await mainDataStore._context.containerRuntime.createDataStore(TestDataObjectType);
		const handleA = dataStoreA.entryPoint;
		const handleB = dataStoreB.entryPoint;
		assert(handleA !== undefined, "Expected a handle when creating a datastoreA");
		assert(handleB !== undefined, "Expected a handle when creating a datastoreB");
		const dataObjectA = (await handleA.get()) as ITestDataObject;
		const dataStoreId = dataObjectA._context.id;

		// store datastore handles
		mainDataStore._root.set("dataStoreA", handleA);
		mainDataStore._root.set("dataStoreB", handleB);

		// unreference datastore handles
		mainDataStore._root.delete("dataStoreA");

		// Summarize and verify datastore are unreferenced and not tombstoned
		await provider.ensureSynchronized();
		const { summaryTree, summaryVersion } = await summarizeNow(summarizer);
		const gcState = getGCStateFromSummary(summaryTree);
		assert(gcState !== undefined, "Expected GC state to be generated");
		assert(
			gcState.gcNodes[handleA.absolutePath] !== undefined,
			"Data Store should exist on gc graph",
		);
		const unreferencedTimestampMs =
			gcState.gcNodes[handleA.absolutePath].unreferencedTimestampMs;
		assert(unreferencedTimestampMs !== undefined, "Data Store should be unreferenced");
		// Summary check
		assert(
			await isDataStoreInSummaryTree(summaryTree, dataStoreId),
			"Data Store should be in the summary!",
		);

		const mainContainer2 = await provider.loadTestContainer(testContainerConfig, {
			[LoaderHeader.version]: summaryVersion,
		});
		const mainDataStore2 = (await mainContainer2.getEntryPoint()) as ITestDataObject;
		summarizer.close();
		container.close();
		mainContainer.close();

		mainDataStore2._root.delete("dataStoreB");
		snapshotCaptured = undefined;
		callCount = 0;
		const { summarizer: summarizer2 } = await loadSummarizer(mainContainer2, summaryVersion);
		assert(callCount === 1, "Expected one snapshot call");
		assert(snapshotCaptured !== undefined, "Expected snapshot to be captured");
		const tree = (snapshotCaptured as ISnapshot).snapshotTree.trees[".channels"].trees;
		const datastoreATree = tree[dataStoreId];
		assert(datastoreATree !== undefined, "DataStoreA should be in the snapshot");
		assertOmittedTree(datastoreATree, "group", "DataStoreA should be omitted");

		await provider.ensureSynchronized();
		callCount = 0;
		const { summaryTree: summaryTree2 } = await summarizeNow(summarizer2);
		assert(callCount === 0, "Expected no snapshot call");
		const gcState2 = getGCStateFromSummary(summaryTree2);
		assert(gcState2 !== undefined, "Expected GC state to be generated");
		const gcNodeA = gcState2.gcNodes[handleA.absolutePath];
		assert(gcNodeA !== undefined, "DataStoreA should exist on gc graph");
		assert(
			gcNodeA.unreferencedTimestampMs === unreferencedTimestampMs,
			"DataStoreA should be unreferenced the same",
		);
		// Summary check
		const dataStoreTreeA = getDataStoreInSummaryTree(summaryTree2, dataStoreId);
		assert(dataStoreTreeA?.type === SummaryType.Handle, "DataStoreA should not have changed!");
	});
});
