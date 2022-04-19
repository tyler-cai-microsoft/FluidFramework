/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IContainer, IFluidModuleWithDetails } from "@fluidframework/container-definitions";
import { Loader } from "@fluidframework/container-loader";
import { requestFluidObject } from "@fluidframework/runtime-utils";

import React from "react";
import ReactDOM from "react-dom";

import { TinyliciousService } from "./tinyliciousService";
import { AppView } from "./appView";
import { containerKillBitId, InventoryListContainerRuntimeFactory } from "./containerCode";
import { IContainerKillBit } from "./containerKillBit";
import { extractStringData, fetchData, applyStringData, writeData } from "./dataHelpers";
import { IInventoryList } from "./inventoryList";

// In interacting with the service, we need to be explicit about whether we're creating a new document vs. loading
// an existing one.  We also need to provide the unique ID for the document we are creating or loading from.

// In this app, we'll choose to create a new document when navigating directly to http://localhost:8080.  For the ID,
// we'll choose to use the current timestamp.  We'll also choose to interpret the URL hash as an existing document's
// ID to load from, so the URL for a document load will look something like http://localhost:8080/#1596520748752.
// These policy choices are arbitrary for demo purposes, and can be changed however you'd like.
let createNew = false;
if (location.hash.length === 0) {
    createNew = true;
    location.hash = Date.now().toString();
}
const documentId = location.hash.substring(1);
document.title = documentId;

async function getInventoryListFromContainer(container: IContainer): Promise<IInventoryList> {
    // Since we're using a ContainerRuntimeFactoryWithDefaultDataStore, our inventory list is available at the URL "/".
    return requestFluidObject<IInventoryList>(container, { url: "/" });
}

async function getContainerKillBitFromContainer(container: IContainer): Promise<IContainerKillBit> {
    // Our kill bit is available at the URL containerKillBitId.
    return requestFluidObject<IContainerKillBit>(container, { url: containerKillBitId });
}

async function start(): Promise<void> {
    const tinyliciousService = new TinyliciousService();

    const load = async (): Promise<IFluidModuleWithDetails> => {
        return {
            module: { fluidExport: new InventoryListContainerRuntimeFactory() },
            details: { package: "no-dynamic-package", config: {} },
        };
    };
    const codeLoader = { load };

    const loader = new Loader({
        urlResolver: tinyliciousService.urlResolver,
        documentServiceFactory: tinyliciousService.documentServiceFactory,
        codeLoader,
    });

    let fetchedData: string | undefined;
    let container: IContainer;
    let inventoryList: IInventoryList;
    let containerKillBit: IContainerKillBit;

    if (createNew) {
        fetchedData = await fetchData();
        container = await loader.createDetachedContainer({ package: "no-dynamic-package", config: {} });
        inventoryList = await getInventoryListFromContainer(container);
        containerKillBit = await getContainerKillBitFromContainer(container);
        await applyStringData(inventoryList, fetchedData);
        await container.attach({ url: documentId });
    } else {
        container = await loader.resolve({ url: documentId });
        containerKillBit = await getContainerKillBitFromContainer(container);
        inventoryList = await getInventoryListFromContainer(container);
    }

    const writeToExternalStorage = async () => {
        // CONSIDER: it's perhaps more-correct to spawn a new client to extract with (to avoid local changes).
        // This can be done by making a loader.request() call with appropriate headers (same as we do for the
        // summarizing client).  E.g.
        // const exportContainer = await loader.resolve(...);
        // const inventoryList = (await exportContainer.request(...)).value;
        // const stringData = extractStringData(inventoryList);
        // exportContainer.close();

        const stringData = await extractStringData(inventoryList);
        await writeData(stringData);

        // Normally would be a void, we return the string here for demo purposes only.
        return stringData;
    };

    const saveAndEndSession = async () => {
        if (!containerKillBit.markedForDestruction) {
            await containerKillBit.markForDestruction();
        }

        if (containerKillBit.dead) {
            return;
        }

        // After the quorum proposal is accepted, our system doesn't allow further edits to the string
        // So we can immediately get the data out even before taking the lock.
        const stringData = await extractStringData(inventoryList);
        if (containerKillBit.dead) {
            return;
        }

        await containerKillBit.volunteerForDestruction();
        if (containerKillBit.dead) {
            return;
        }

        await writeData(stringData);
        if (!containerKillBit.haveDestructionTask()) {
            throw new Error("Lost task during write");
        } else {
            await containerKillBit.setDead();
        }
    };

    // Given an IInventoryList, we can render the list and provide controls for users to modify it.
    const div = document.getElementById("content") as HTMLDivElement;
    ReactDOM.render(
        <AppView
            importedStringData={ fetchedData }
            inventoryList={ inventoryList }
            writeToExternalStorage={ writeToExternalStorage }
            containerKillBit={ containerKillBit }
            saveAndEndSession={ saveAndEndSession }
        />,
        div,
    );
}

start().catch((error) => console.error(error));
