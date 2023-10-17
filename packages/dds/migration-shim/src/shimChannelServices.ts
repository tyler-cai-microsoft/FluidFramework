/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
	type IDeltaConnection,
	type IChannelServices,
	type IChannelStorageService,
} from "@fluidframework/datastore-definitions";
import { ShimDeltaConnection } from "./shimDeltaConnection";
import { type IShimDeltaHandler } from "./types";

/**
 * ShimChannelServices wraps an existing IChannelServices object and provides a new ShimDeltaConnection
 * object in place of the original deltaConnection object.
 *
 * ShimChannelServices allows us to encapsulate all the wrapping logic without having to modify the original services.
 *
 * At some point, in the SharedObject code we call this.services.deltaConnection.attach(this.handler). Therefore before
 * we call attach, we need to swap out the deltaConnection object for the ShimDeltaConnection object. This makes
 * it consistent as we will always be passing this shim
 */
export class ShimChannelServices implements IChannelServices {
	public constructor(channelServices: IChannelServices, shimDeltaHandler: IShimDeltaHandler) {
		this.deltaConnection = new ShimDeltaConnection(
			channelServices.deltaConnection,
			shimDeltaHandler,
		);
		this.objectStorage = channelServices.objectStorage;
	}
	public readonly deltaConnection: ShimDeltaConnection;
	public readonly objectStorage: IChannelStorageService;
}

/**
 * NoDeltasChannelServices wraps an existing IChannelServices object and provides a new objectStorage
 * object in place of the original deltaConnection object. During load, if the runtime is in a detached state, we only
 * want to connect once on attached. Thus this is here to catch us from making a mistake. This should follow the
 * Single-Responsibility Principle.
 *
 * This is for the scenario for when we rehydrate a container in a detached state, load a SharedObject and later we
 * call connect. We don't store the services in the SharedObject, and the goal of this class is to mimic that and
 * prevent us from accidentally setting our services twice.
 *
 * Steps:
 * 1. Load SharedObject in detached container runtime state
 * 2. Attach detached container runtime
 * 3. Connect SharedObject.
 *
 * Refer to SharedObject.load for the scenario.
 *
 * This potentially can be baked into the ShimChannelServices.
 */
export class NoDeltasChannelServices implements IChannelServices {
	public constructor(channelServices: IChannelServices) {
		this.objectStorage = channelServices.objectStorage;
	}

	public get deltaConnection(): IDeltaConnection {
		throw new Error("No deltaConnection available");
	}
	public readonly objectStorage: IChannelStorageService;
}
