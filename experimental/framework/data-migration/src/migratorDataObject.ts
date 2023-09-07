/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedDirectory } from "@fluidframework/map";
import { DataObject, DataObjectTypes, IDataObjectProps } from "@fluidframework/aqueduct";
import { IChannel, IChannelFactory } from "@fluidframework/datastore-definitions";
import { assert } from "@fluidframework/common-utils";
import { IModifiableFluidDataStoreContext } from "./types";
import { MigratorFluidDataStoreRuntime } from "./migratorFluidDataStoreRuntime";

/**
 * The concept of this class is to scope changes only necessary to data migration here.
 *
 * There's a vein of thought to put the migration code here, where it extends the MigrationDataObject.
 * Another thought is to party on the whole document. We'll need both solutions, so this is one way of doing it.
 */
export class MigratorDataObject<I extends DataObjectTypes = DataObjectTypes> extends DataObject<I> {
	private readonly migratorRuntime: MigratorFluidDataStoreRuntime;

	public get _root(): ISharedDirectory {
		return this.root;
	}

	// Not sure if this is the right place for it
	public changeType(pkg: readonly string[]) {
		const context = this.context as unknown as IModifiableFluidDataStoreContext;
		context.pkg = pkg;
	}

	public constructor(props: IDataObjectProps<I>) {
		super(props);
		assert((props.runtime as any).replaceChannel !== undefined, "expected migrator runtime");
		this.migratorRuntime = props.runtime as MigratorFluidDataStoreRuntime;
	}

	// Deleting DDSes is dangerous it's best just to replace
	public async replaceChannel(channel: IChannel, factory: IChannelFactory) {
		const { newChannel } = await this.migratorRuntime.replaceChannel(channel.id, factory.type);
		return newChannel;
	}

	// Delete can be mainly achieved by removing all the data from the dds and deleting all its handles.
}
