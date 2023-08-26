/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { DataObjectFactory, IDataObjectProps } from "@fluidframework/aqueduct";
import { NamedFluidDataStoreRegistryEntries } from "@fluidframework/runtime-definitions";
import { IChannelFactory } from "@fluidframework/datastore-definitions";
import { MigratorDataObject } from "./migratorDataObject";
import { MigratorFluidDataStoreRuntime } from "./migratorFluidDataStoreRuntime";

/**
 * The concept of this class is to scope changes only necessary to data migration here.
 *
 * This allows us to create the MigratorFluidDataStoreRuntime
 */
export class MigratorFluidRuntimeFactory<
	TObj extends MigratorDataObject = MigratorDataObject,
> extends DataObjectFactory<TObj> {
	constructor(
		public readonly type: string,
		ctor: new (props: IDataObjectProps) => TObj,
		sharedObjects: readonly IChannelFactory[] = [],
		registryEntries?: NamedFluidDataStoreRegistryEntries,
		runtimeFactory: typeof MigratorFluidDataStoreRuntime = MigratorFluidDataStoreRuntime,
	) {
		super(type, ctor, sharedObjects, [], registryEntries, runtimeFactory);
	}
}
