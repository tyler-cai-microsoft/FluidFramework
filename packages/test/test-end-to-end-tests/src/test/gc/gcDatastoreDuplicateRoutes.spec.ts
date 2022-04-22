/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import {
    ContainerRuntimeFactoryWithDefaultDataStore,
    DataObjectFactory,
} from "@fluidframework/aqueduct";
import { IContainer } from "@fluidframework/container-definitions";
import { IRequest } from "@fluidframework/core-interfaces";
import { requestFluidObject } from "@fluidframework/runtime-utils";
import { ITestObjectProvider } from "@fluidframework/test-utils";
import { describeNoCompat } from "@fluidframework/test-version-utils";
import {
    gcBlobPrefix,
    gcTreeKey,
    IAckedSummary,
    IContainerRuntimeOptions,
} from "@fluidframework/container-runtime";
import { IContainerRuntimeBase, IGarbageCollectionState } from "@fluidframework/runtime-definitions";
import { ISummaryBlob, ISummaryTree } from "@fluidframework/protocol-definitions";
import { SharedMap } from "@fluidframework/map";
import { ISummaryContext } from "@fluidframework/driver-definitions";
import { TelemetryNullLogger } from "@fluidframework/common-utils";
import { TestDataObject, loadSummarizer, submitAndAckSummary } from "../mockSummarizerClient";
import { mockConfigProvider } from "./mockConfigProivder";
import { wrapDocumentServiceFactory } from "./gcDriverWrappers";

/**
 * Validates this scenario: When a datastore is aliased that it is considered a root datastore and always referenced
 */
describeNoCompat("GC Data Store Duplicates", (getTestObjectProvider) => {
    let provider: ITestObjectProvider;
    const dataObjectFactory = new DataObjectFactory(
        "TestDataObject",
        TestDataObject,
        [],
        []);

    const runtimeOptions: IContainerRuntimeOptions = {
        summaryOptions: {
            disableSummaries: true,
        },
        gcOptions: {
            gcAllowed: true,
        },
    };
    const innerRequestHandler = async (request: IRequest, runtime: IContainerRuntimeBase) =>
        runtime.IFluidHandleContext.resolveHandle(request);
    const runtimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
        dataObjectFactory,
        [
            [dataObjectFactory.type, Promise.resolve(dataObjectFactory)],
        ],
        undefined,
        [innerRequestHandler],
        runtimeOptions,
    );

    const settings = {
        "Fluid.GarbageCollection.LogUnknownOutboundRoutes": "true",
        "Fluid.GarbageCollection.WriteDataAtRoot": "true",
    };
    const configProvider = mockConfigProvider(settings);
    settings["Fluid.GarbageCollection.UseDataStoreAliasing"] = "false";

    let mainContainer: IContainer;
    let mainDataStore: TestDataObject;
    let latestUploadedSummary: ISummaryTree | undefined;
    let latestAckedSummary: IAckedSummary | undefined;

    /**
     * Callback that will be called by the document storage service whenever a summary is uploaded by the client.
     * Update the summary context to include the summary proposal and ack handle as per the latest ack for the
     * document.
     */
    function uploadSummaryCb(summaryTree: ISummaryTree, context: ISummaryContext): ISummaryContext {
        latestUploadedSummary = summaryTree;
        const newSummaryContext = { ...context };
        // If we received an ack for this document, update the summary context with its information. The
        // server rejects the summary if it doesn't have the proposal and ack handle of the previous
        // summary.
        if (latestAckedSummary !== undefined) {
            newSummaryContext.ackHandle = latestAckedSummary.summaryAck.contents.handle;
            newSummaryContext.proposalHandle = latestAckedSummary.summaryOp.contents.handle;
        }
        return newSummaryContext;
    }

    const logger = new TelemetryNullLogger();

    async function summarizeOnNewContainerAndGetGCTree(summaryVersion?: string): Promise<IGarbageCollectionState> {
        await provider.ensureSynchronized();
        const summarizerClient = await loadSummarizer(
            provider,
            runtimeFactory,
            mainContainer.deltaManager.lastSequenceNumber,
            summaryVersion,
            { configProvider },
        );
        const summaryResult = await submitAndAckSummary(provider, summarizerClient, logger, false /* fullTree */);
        latestAckedSummary = summaryResult.ackedSummary;
        assert(latestUploadedSummary !== undefined, "Did not get a summary");
        return getGCContentFromTree(latestUploadedSummary);
    }

    const createContainer = async (): Promise<IContainer> => {
        return provider.createContainer(runtimeFactory, { configProvider });
    };

    const getGCContentFromTree = (summary: ISummaryTree): IGarbageCollectionState => {
        const gcTree: ISummaryTree = summary.tree[gcTreeKey] as ISummaryTree;
        const gcBlob = gcTree.tree[`${gcBlobPrefix}_root`] as ISummaryBlob;
        const content = JSON.parse(gcBlob.content as string) as IGarbageCollectionState;
        return content;
    };

    beforeEach(async () => {
        provider = getTestObjectProvider();
        // Wrap the document service factory in the driver so that the `uploadSummaryCb` function is called every
        // time the summarizer client uploads a summary.
        (provider as any)._documentServiceFactory = wrapDocumentServiceFactory(
            provider.documentServiceFactory,
            uploadSummaryCb,
        );

        // Create a Container for the first client.
        mainContainer = await createContainer();
        mainDataStore = await requestFluidObject<TestDataObject>(mainContainer, "default");
        await provider.ensureSynchronized();
    });

    it("Back routes added by GC are removed when passed from data stores to DDSs", async () => {
        const dds = SharedMap.create(mainDataStore.dataStoreRuntime);
        mainDataStore._root.set("dds", dds.handle);

        await summarizeOnNewContainerAndGetGCTree();

        // Change ds1 but not the root dds
        dds.set("change", "change1");

        assert(latestAckedSummary !== undefined, "Ack'd summary isn't available as expected");
        const gcTree = await summarizeOnNewContainerAndGetGCTree(latestAckedSummary.summaryAck.contents.handle);
        assert(gcTree !== undefined, "Expected a gc tree!");
        const routes = gcTree.gcNodes[`/${mainDataStore.id}/${mainDataStore._root.id}`].outboundRoutes;
        const seenRoutes = new Set<string>();
        routes.forEach((route) => {
            assert(!seenRoutes.has(route), `There should be no duplicate routes! Duplicate Route: ${route}`);
            seenRoutes.add(route);
        });
    });
});
