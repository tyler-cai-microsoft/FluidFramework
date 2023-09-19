/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";

import { SharedCell } from "@fluidframework/cell";
import { Deferred } from "@fluidframework/core-utils";
import { AttachState, IContainer, LoaderHeader } from "@fluidframework/container-definitions";
import { ConnectionState, Loader } from "@fluidframework/container-loader";
import { ContainerMessageType } from "@fluidframework/container-runtime";
import { IFluidHandle, IRequest } from "@fluidframework/core-interfaces";
import { DataStoreMessageType } from "@fluidframework/datastore";
import { IDocumentServiceFactory, IResolvedUrl } from "@fluidframework/driver-definitions";
import { Ink, IColor } from "@fluidframework/ink";
import { SharedMap, SharedDirectory } from "@fluidframework/map";
import { SharedMatrix } from "@fluidframework/matrix";
import { MergeTreeDeltaType } from "@fluidframework/merge-tree";
import { ConsensusQueue } from "@fluidframework/ordered-collection";
import { ISummaryTree } from "@fluidframework/protocol-definitions";
import { ConsensusRegisterCollection } from "@fluidframework/register-collection";
import { IFluidDataStoreContext } from "@fluidframework/runtime-definitions";
import { requestFluidObject } from "@fluidframework/runtime-utils";
import { SharedString } from "@fluidframework/sequence";
import { SparseMatrix } from "@fluid-experimental/sequence-deprecated";
import { createChildLogger } from "@fluidframework/telemetry-utils";
import {
	ITestContainerConfig,
	DataObjectFactoryType,
	ITestObjectProvider,
	ChannelFactoryRegistry,
	ITestFluidObject,
	LocalCodeLoader,
	SupportedExportInterfaces,
	TestFluidObjectFactory,
	waitForContainerConnection,
	timeoutPromise,
} from "@fluidframework/test-utils";
import {
	describeFullCompat,
	describeNoCompat,
	itExpects,
} from "@fluid-internal/test-version-utils";

const detachedContainerRefSeqNumber = 0;

const sharedStringId = "ss1Key";
const sharedMapId = "sm1Key";
const crcId = "crc1Key";
const cocId = "coc1Key";
const sharedDirectoryId = "sd1Key";
const sharedCellId = "scell1Key";
const sharedMatrixId = "smatrix1Key";
const sharedInkId = "sink1Key";
const sparseMatrixId = "sparsematrixKey";

const registry: ChannelFactoryRegistry = [
	[sharedStringId, SharedString.getFactory()],
	[sharedMapId, SharedMap.getFactory()],
	[crcId, ConsensusRegisterCollection.getFactory()],
	[sharedDirectoryId, SharedDirectory.getFactory()],
	[sharedCellId, SharedCell.getFactory()],
	[sharedInkId, Ink.getFactory()],
	[sharedMatrixId, SharedMatrix.getFactory()],
	[cocId, ConsensusQueue.getFactory()],
	[sparseMatrixId, SparseMatrix.getFactory()],
];

const testContainerConfig: ITestContainerConfig = {
	fluidDataObjectType: DataObjectFactoryType.Test,
	registry,
};

const createFluidObject = async (dataStoreContext: IFluidDataStoreContext, type: string) => {
	return requestFluidObject<ITestFluidObject>(
		await dataStoreContext.containerRuntime.createDataStore(type),
		"",
	);
};

describeFullCompat("Detached Container", (getTestObjectProvider) => {
	let provider: ITestObjectProvider;
	let request: IRequest;
	let loader: Loader;

	beforeEach(() => {
		provider = getTestObjectProvider();
		request = provider.driver.createCreateNewRequest(provider.documentId);
		loader = provider.makeTestLoader(testContainerConfig) as Loader;
	});

	it("Create detached container", async () => {
		const container: IContainer = await loader.createDetachedContainer(
			provider.defaultCodeDetails,
		);
		assert.strictEqual(
			container.attachState,
			AttachState.Detached,
			"Container should be detached",
		);
		assert.strictEqual(container.closed, false, "Container should be open");
		assert.strictEqual(
			container.deltaManager.inbound.length,
			0,
			"Inbound queue should be empty",
		);
		assert.strictEqual(
			container.getQuorum().getMembers().size,
			0,
			"Quorum should not contain any members",
		);
		assert.strictEqual(
			container.connectionState,
			ConnectionState.Disconnected,
			"Container should be in disconnected state!!",
		);

		if (container.getSpecifiedCodeDetails !== undefined) {
			assert.strictEqual(
				container.getSpecifiedCodeDetails()?.package,
				provider.defaultCodeDetails.package,
				"Specified package should be same as provided",
			);
		}
		if (container.getLoadedCodeDetails !== undefined) {
			assert.strictEqual(
				container.getLoadedCodeDetails()?.package,
				provider.defaultCodeDetails.package,
				"Loaded package should be same as provided",
			);
		}
	});

	it("Attach detached container", async () => {
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);
		await container.attach(request);
		assert.strictEqual(
			container.attachState,
			AttachState.Attached,
			"Container should be attached",
		);
		assert.strictEqual(container.closed, false, "Container should be open");
		assert.strictEqual(
			container.deltaManager.inbound.length,
			0,
			"Inbound queue should be empty",
		);
		const containerId = (container.resolvedUrl as IResolvedUrl).id;
		assert.ok(container, "No container ID");
		if (provider.driver.type === "local") {
			assert.strictEqual(containerId, provider.documentId, "Doc id is not matching!!");
		}
	});

	it("DataStores in detached container", async () => {
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);
		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		if (response.mimeType !== "fluid/object" && response.status !== 200) {
			assert.fail("Root dataStore should be created in detached container");
		}
		const dataStore = response.value as ITestFluidObject;

		// Create a sub dataStore of type TestFluidObject and verify that it is attached.
		const subDataStore = await createFluidObject(dataStore.context, "default");
		dataStore.root.set("attachKey", subDataStore.handle);

		// Get the sub dataStore's root channel and verify that it is attached.
		const testChannel = await subDataStore.runtime.getChannel("root");
		assert.strictEqual(testChannel.isAttached(), false, "Channel should be detached!!");
		assert.strictEqual(
			subDataStore.context.attachState,
			AttachState.Detached,
			"DataStore should be detached!!",
		);
	});

	it("DataStores in attached container", async () => {
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);
		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;

		// Create a sub dataStore of type TestFluidObject.
		const testDataStore = await createFluidObject(dataStore.context, "default");
		dataStore.root.set("attachKey", testDataStore.handle);

		// Now attach the container
		await container.attach(request);

		assert(
			testDataStore.runtime.attachState !== AttachState.Detached,
			"DataStore should be attached!!",
		);

		// Get the sub dataStore's "root" channel and verify that it is attached.
		const testChannel = await testDataStore.runtime.getChannel("root");
		assert.strictEqual(testChannel.isAttached(), true, "Channel should be attached!!");

		assert.strictEqual(
			testDataStore.context.attachState,
			AttachState.Attached,
			"DataStore should be attached!!",
		);
	});

	it("can create DDS in detached container and attach / update it", async function () {
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);
		const dsClient1 = await requestFluidObject<ITestFluidObject>(container, "/");

		// Create a DDS after the root data store is created and loaded.
		const mapClient1 = SharedMap.create(dsClient1.runtime);
		dsClient1.root.set("map", mapClient1.handle);

		// Attach the container and validate that the DDS is attached.
		await container.attach(provider.driver.createCreateNewRequest(provider.documentId));
		assert(mapClient1.isAttached(), "The map should be attached after the container attaches.");
		await waitForContainerConnection(container);
		provider.updateDocumentId(container.resolvedUrl);
		const url: any = await container.getAbsoluteUrl("");
		// Load a second container and validate it can load the DDS.
		const container2 = await loader.resolve({ url });
		const dsClient2 = await requestFluidObject<ITestFluidObject>(container2, "/");
		const mapClient2 = await dsClient2.root.get<IFluidHandle<SharedMap>>("map")?.get();
		assert(mapClient2 !== undefined, "Map is not available in the second client");

		// Make a change in the first client's DDS and validate that the change is reflected in the second client.
		mapClient1.set("key1", "value1");
		await provider.ensureSynchronized();
		assert.strictEqual(
			mapClient2.get("key1"),
			"value1",
			"Map change not reflected in second client.",
		);

		// Make a change in the second client's DDS and validate that the change is reflected in the first client.
		mapClient2.set("key2", "value2");
		await provider.ensureSynchronized();
		assert.strictEqual(
			mapClient1.get("key2"),
			"value2",
			"Map change not reflected in first client.",
		);
	});

	it("Load attached container and check for dataStores", async () => {
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);
		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;

		// Create a sub dataStore of type TestFluidObject.
		const subDataStore1 = await createFluidObject(dataStore.context, "default");
		dataStore.root.set("attachKey", subDataStore1.handle);

		// Now attach the container and get the sub dataStore.
		await container.attach(request);

		// Now load the container from another loader.
		const loader2 = provider.makeTestLoader(testContainerConfig);
		// Create a new request url from the resolvedUrl of the first container.
		assert(container.resolvedUrl);
		const requestUrl2 = await provider.urlResolver.getAbsoluteUrl(container.resolvedUrl, "");
		const container2 = await loader2.resolve({ url: requestUrl2 });

		// Get the sub dataStore and assert that it is attached.
		const response2 = await container2.request({ url: `/${subDataStore1.context.id}` });
		const subDataStore2 = response2.value as ITestFluidObject;
		assert(
			subDataStore2.runtime.attachState !== AttachState.Detached,
			"DataStore should be attached!!",
		);

		// Verify the attributes of the root channel of both sub dataStores.
		const testChannel1 = await subDataStore1.runtime.getChannel("root");
		const testChannel2 = await subDataStore2.runtime.getChannel("root");
		assert.strictEqual(testChannel2.isAttached(), true, "Channel should be attached!!");
		assert.strictEqual(
			testChannel2.isAttached(),
			testChannel1.isAttached(),
			"Value for isAttached should persist!!",
		);

		assert.strictEqual(
			JSON.stringify(testChannel2.summarize()),
			JSON.stringify(testChannel1.summarize()),
			"Value for summarize should be same!!",
		);
	});

	it("Fire ops during container attach for shared string", async () => {
		const ops = { pos1: 0, seg: "b", type: 0 };
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<SharedString>(sharedStringId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.equal(message.type, ContainerMessageType.FluidDataStoreOp);

			assert.equal(
				((message.contents as { contents: unknown }).contents as { type?: unknown }).type,
				DataStoreMessageType.ChannelOp,
			);

			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				sharedStringId,
				"Address should be shared string",
			);
			assert.strictEqual(
				JSON.stringify(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents?: unknown }
					).contents,
				),
				JSON.stringify(ops),
				"Ops should be equal",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		testChannel1.insertText(0, "a");
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		testChannel1.insertText(0, "b");
		await containerP;

		await defPromise.promise;
	});

	it("Fire ops during container attach for shared map", async () => {
		const ops = { key: "1", type: "set", value: { type: "Plain", value: "b" } };
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<SharedMap>(sharedMapId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				sharedMapId,
				"Address should be shared map",
			);
			assert.strictEqual(
				JSON.stringify(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents?: unknown }
					).contents,
				),
				JSON.stringify(ops),
				"Ops should be equal",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		testChannel1.set("0", "a");
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		testChannel1.set("1", "b");
		await containerP;

		await defPromise.promise;
	});

	it("Fire channel attach ops during container attach", async () => {
		const testChannelId = "testChannel1";
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { id?: unknown }
				).id,
				testChannelId,
				"Channel id should match",
			);
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { type?: unknown }
				).type,
				SharedMap.getFactory().type,
				"Channel type should match",
			);
			assert.strictEqual(
				((message.contents as { contents: unknown }).contents as { type?: unknown }).type,
				DataStoreMessageType.Attach,
				"Op should be an attach op",
			);
			defPromise.resolve();
			return 0;
		});

		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire attach op
		const testChannel = dataStore.runtime.createChannel(
			testChannelId,
			SharedMap.getFactory().type,
		);
		testChannel.handle.attachGraph();
		await containerP;
		await defPromise.promise;
	});

	it("Fire dataStore attach ops during container attach", async () => {
		const testDataStoreType = "default";
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;

		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		const router = await dataStore.context.containerRuntime.createDataStore([
			testDataStoreType,
		]);
		const comp2 = await requestFluidObject<ITestFluidObject>(router, "/");

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			try {
				assert.strictEqual(
					message.type,
					ContainerMessageType.Attach,
					"Op should be an attach op",
				);
				assert.strictEqual(
					(message.contents as { id?: unknown }).id,
					comp2.context.id,
					"DataStore id should match",
				);
				assert.strictEqual(
					(message.contents as { type?: unknown }).type,
					testDataStoreType,
					"DataStore type should match",
				);
				defPromise.resolve();
			} catch (e) {
				defPromise.reject(e);
			}
			return 0;
		});

		// Fire attach op
		dataStore.root.set("attachComp", comp2.handle);
		await containerP;
		await defPromise.promise;
	});

	it("Fire ops during container attach for consensus register collection", async () => {
		const op = {
			key: "1",
			type: "write",
			serializedValue: JSON.stringify("b"),
			refSeq: detachedContainerRefSeqNumber,
		};
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<ConsensusRegisterCollection<string>>(
			crcId,
		);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				crcId,
				"Address should be consensus register collection",
			);
			assert.strictEqual(
				JSON.stringify(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents?: unknown }
					).contents,
				),
				JSON.stringify(op),
				"Op should be same",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		await testChannel1.write("0", "a");
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		testChannel1.write("1", "b");
		await containerP;
		await defPromise.promise;
	});

	it("Fire ops during container attach for shared directory", async () => {
		const op = {
			key: "1",
			path: "/",
			type: "set",
			value: { type: "Plain", value: "b" },
		};
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<SharedDirectory>(sharedDirectoryId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				sharedDirectoryId,
				"Address should be shared directory",
			);
			assert.strictEqual(
				JSON.stringify(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents?: unknown }
					).contents,
				),
				JSON.stringify(op),
				"Op should be same",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		testChannel1.set("0", "a");
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		testChannel1.set("1", "b");
		await containerP;
		await defPromise.promise;
	});

	it("Fire ops during container attach for shared cell", async () => {
		const op = { type: "setCell", value: { value: "b" } };
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<SharedCell>(sharedCellId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				sharedCellId,
				"Address should be shared directory",
			);
			assert.strictEqual(
				JSON.stringify(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents?: unknown }
					).contents,
				),
				JSON.stringify(op),
				"Op should be same",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		testChannel1.set("a");
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		testChannel1.set("b");
		await containerP;
		await defPromise.promise;
	});

	it("Fire ops during container attach for shared ink", async () => {
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<Ink>(sharedInkId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				sharedInkId,
				"Address should be ink",
			);
			assert.strictEqual(
				(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents: unknown }
					).contents as { type?: unknown }
				).type,
				"createStroke",
				"Op type should be same",
			);
			assert.strictEqual(
				(
					(
						(
							(
								(message.contents as { contents: unknown }).contents as {
									content: unknown;
								}
							).content as { contents: unknown }
						).contents as { pen: unknown }
					).pen as { thickness?: unknown }
				).thickness,
				20,
				"Thickness should be same",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		const color: IColor = {
			a: 2,
			r: 127,
			b: 127,
			g: 127,
		};
		testChannel1.createStroke({ color, thickness: 10 });
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		testChannel1.createStroke({ color, thickness: 20 });
		await containerP;
		await defPromise.promise;
	});

	it("Fire ops during container attach for consensus ordered collection", async () => {
		const op = { opName: "add", value: JSON.stringify("s") };
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<ConsensusQueue>(cocId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				cocId,
				"Address should be consensus queue",
			);
			assert.strictEqual(
				JSON.stringify(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents?: unknown }
					).contents,
				),
				JSON.stringify(op),
				"Op should be same",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		await testChannel1.add("a");
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		testChannel1.add("s");

		await containerP;
		await defPromise.promise;
	});

	it("Fire ops during container attach for sparse matrix", async () => {
		const seg = { items: ["s"] };
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<SparseMatrix>(sparseMatrixId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			try {
				if (runtimeMessage === false) {
					return;
				}
				const envelope = message.contents.contents.content;
				assert.strictEqual(
					envelope.address,
					sparseMatrixId,
					"Address should be sparse matrix",
				);
				if (envelope.contents.type === MergeTreeDeltaType.INSERT) {
					assert.strictEqual(
						JSON.stringify(envelope.contents.seg),
						JSON.stringify(seg),
						"Seg should be same",
					);
				}
				defPromise.resolve();
			} catch (e) {
				defPromise.reject(e);
			}
		});

		// Fire op before attaching the container
		testChannel1.insertRows(0, 1);
		testChannel1.insertCols(0, 1);
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		testChannel1.setItems(0, 0, seg.items);

		await containerP;
		await defPromise.promise;
	});

	it.skip("Fire ops during container attach for shared matrix", async () => {
		const op = { pos1: 0, seg: 9, type: 0, target: "rows" };
		const defPromise = new Deferred<void>();
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;
		const testChannel1 = await dataStore.getSharedObject<SharedMatrix>(sharedMatrixId);

		dataStore.context.containerRuntime.on("op", (message, runtimeMessage) => {
			if (runtimeMessage === false) {
				return;
			}
			assert.strictEqual(
				(
					((message.contents as { contents: unknown }).contents as { content: unknown })
						.content as { address?: unknown }
				).address,
				sharedMatrixId,
				"Address should be shared matrix",
			);
			assert.strictEqual(
				JSON.stringify(
					(
						(
							(message.contents as { contents: unknown }).contents as {
								content: unknown;
							}
						).content as { contents?: unknown }
					).contents,
				),
				JSON.stringify(op),
				"Op should be same",
			);
			defPromise.resolve();
			return 0;
		});

		// Fire op before attaching the container
		testChannel1.insertRows(0, 20);
		testChannel1.insertCols(0, 20);
		const containerP = container.attach(request);
		if (container.attachState === AttachState.Detached) {
			await timeoutPromise((resolve) => container.once("attaching", resolve));
		}

		// Fire op after the summary is taken and before it is attached.
		testChannel1.insertRows(0, 9);

		await containerP;
		await defPromise.promise;
	});

	// TODO: remove this test when caching is removed (AB#5046)
	it("Load attached container from cache and check if they are same", async () => {
		loader.services.options.cache = true;
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

		// Now attach the container and get the sub dataStore.
		await container.attach(request);

		// Create a new request url from the resolvedUrl of the first container.
		assert(container.resolvedUrl);
		const requestUrl2 = await provider.urlResolver.getAbsoluteUrl(container.resolvedUrl, "");
		const container2 = await loader.resolve({
			url: requestUrl2,
			headers: { [LoaderHeader.cache]: true },
		});
		assert.strictEqual(container, container2, "Both containers should be same");
	});
});

// Review: Run with Full Compat?
describeNoCompat("Detached Container", (getTestObjectProvider) => {
	let provider: ITestObjectProvider;
	let request: IRequest;
	let loader: Loader;

	beforeEach(() => {
		provider = getTestObjectProvider();
		request = provider.driver.createCreateNewRequest(provider.documentId);
		loader = provider.makeTestLoader(testContainerConfig) as Loader;
	});

	it("Retry attaching detached container", async () => {
		let retryTimes = 1;
		const documentServiceFactory: IDocumentServiceFactory = {
			...provider.documentServiceFactory,
			createContainer: async (createNewSummary, createNewResolvedUrl, logger) => {
				if (retryTimes > 0) {
					retryTimes -= 1;
					const error = new Error("Test Error");
					(error as any).canRetry = true;
					throw error;
				}
				return provider.documentServiceFactory.createContainer(
					createNewSummary,
					createNewResolvedUrl,
					logger,
				);
			},
		};

		const fluidExport: SupportedExportInterfaces = {
			IFluidDataStoreFactory: new TestFluidObjectFactory(registry),
		};
		const codeLoader = new LocalCodeLoader([[provider.defaultCodeDetails, fluidExport]]);
		const mockLoader = new Loader({
			urlResolver: provider.urlResolver,
			documentServiceFactory,
			codeLoader,
			logger: createChildLogger(),
		});

		const container = await mockLoader.createDetachedContainer(provider.defaultCodeDetails);
		await container.attach(request);
		assert.strictEqual(
			container.attachState,
			AttachState.Attached,
			"Container should be attached",
		);
		assert.strictEqual(container.closed, false, "Container should be open");
		assert.strictEqual(
			container.deltaManager.inbound.length,
			0,
			"Inbound queue should be empty",
		);
		const containerId = (container.resolvedUrl as IResolvedUrl).id;
		assert.ok(containerId, "No container ID");
		if (provider.driver.type === "local") {
			assert.strictEqual(containerId, provider.documentId, "Doc id is not matching!!");
		}
		assert.strictEqual(retryTimes, 0, "Should not succeed at first time");
	}).timeout(5000);

	itExpects(
		"Container should be closed on failed attach with non retryable error",
		[{ eventName: "fluid:telemetry:Container:ContainerClose", error: "Test Error" }],
		async () => {
			const container = await loader.createDetachedContainer(provider.defaultCodeDetails);

			const oldFunc = provider.documentServiceFactory.createContainer;
			provider.documentServiceFactory.createContainer = (a, b, c) => {
				throw new Error("Test Error");
			};
			let failedOnce = false;
			try {
				await container.attach(request);
			} catch (e) {
				failedOnce = true;
				provider.documentServiceFactory.createContainer = oldFunc;
			}
			assert.strictEqual(failedOnce, true, "Attach call should fail");
			assert.strictEqual(container.closed, true, "Container should be closed");
		},
	);

	it("Directly attach container through service factory, should resolve to same container", async () => {
		const container = await loader.createDetachedContainer(provider.defaultCodeDetails);
		// Get the root dataStore from the detached container.
		const response = await container.request({ url: "/" });
		const dataStore = response.value as ITestFluidObject;

		// Create a sub dataStore of type TestFluidObject.
		const subDataStore1 = await createFluidObject(dataStore.context, "default");
		dataStore.root.set("attachKey", subDataStore1.handle);

		const summaryForAttach: ISummaryTree = JSON.parse(container.serialize());
		const resolvedUrl = await provider.urlResolver.resolve(request);
		assert(resolvedUrl);
		const service = await provider.documentServiceFactory.createContainer(
			summaryForAttach,
			resolvedUrl,
		);
		const absoluteUrl = await provider.urlResolver.getAbsoluteUrl(service.resolvedUrl, "/");

		const container2 = await loader.resolve({ url: absoluteUrl });
		// Get the root dataStore from the detached container.
		const response2 = await container2.request({ url: "/" });
		const dataStore2 = response2.value as ITestFluidObject;
		assert.strictEqual(
			dataStore2.root.get("attachKey").absolutePath,
			subDataStore1.handle.absolutePath,
			"Stored handle should match!!",
		);
	});
});
