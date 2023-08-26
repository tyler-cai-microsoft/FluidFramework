/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { FluidObject } from "@fluidframework/core-interfaces";
import { IFluidDataStoreContext } from "@fluidframework/runtime-definitions";
import { FluidDataStoreRuntime, ISharedObjectRegistry } from "@fluidframework/datastore";
import { IFluidDataStoreRuntime } from "@fluidframework/datastore-definitions";
import { IModifiableFluidDataStoreContext } from "./types";

/**
 * The concept of this class is to scope changes only necessary to data migration here.
 *
 * This class enables replacing channels. Deleting channels is risky. We can achieve
 * very similar results by removing all the handles and deleting all the data.
 */
export class MigratorFluidDataStoreRuntime extends FluidDataStoreRuntime {
	public constructor(
		protected readonly _dataStoreContext: IFluidDataStoreContext,
		protected readonly _sharedObjectRegistry: ISharedObjectRegistry,
		existing: boolean,
		initializeEntryPoint?: (runtime: IFluidDataStoreRuntime) => Promise<FluidObject>,
	) {
		super(_dataStoreContext, _sharedObjectRegistry, existing, initializeEntryPoint);
	}

	public async replaceChannel(id: string, channelType: string) {
		const oldChannel = await this.getChannel(id);
		const dataStoreContext = this
			._dataStoreContext as unknown as IModifiableFluidDataStoreContext;
		if (dataStoreContext.summarizerNode.getChild(id) !== undefined) {
			// Local channels don't have summarizer nodes.
			dataStoreContext.summarizerNode.deleteChild(id);
		}
		this.contexts.delete(id);
		const newChannel = this.createChannel(id, channelType);
		this.bind(newChannel.handle);
		return { oldChannel, newChannel };
	}
}
