/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
	type IChannelAttributes,
	type IFluidDataStoreRuntime,
	type IChannelServices,
	type IChannelFactory,
} from "@fluidframework/datastore-definitions";
import { type SharedObject } from "@fluidframework/shared-object-base";
import { MigrationShim } from "./migrationShim";

/**
 * {@link @fluidframework/datastore-definitions#IChannelFactory} for {@link MigrationShim}.
 *
 * Creates the migration shim that allows a migration from legacy shared tree to shared tree.
 * Note: There may be a need for 3 different factories for different parts of the migration.
 * That or three different shims.
 * 1. pre-migration
 * 2. after a summary has been generated but there may still be potential v1 ops
 * 3. post-migration after a summary has been generated and the msn has moved far enough forward for only v2 ops
 *
 * @sealed
 */
export class MigrationShimFactory<TOld extends SharedObject, TNew extends SharedObject>
	implements IChannelFactory
{
	public constructor(
		private readonly oldFactory: IChannelFactory,
		private readonly newFactory: IChannelFactory,
		private readonly populateNewChannelFn: (oldChannel: TOld, newChannel: TNew) => void,
	) {}

	/**
	 * TODO: type documentation
	 *
	 * {@link @fluidframework/datastore-definitions#IChannelFactory."type"}
	 */
	public get type(): string {
		return this.oldFactory.type;
	}

	/**
	 * TODO: attributes documentation
	 *
	 * {@link @fluidframework/datastore-definitions#IChannelFactory.attributes}
	 */
	public get attributes(): IChannelAttributes {
		return this.oldFactory.attributes;
	}

	/**
	 * {@link @fluidframework/datastore-definitions#IChannelFactory.load}
	 *
	 * TODO: load documentation
	 */
	public async load(
		runtime: IFluidDataStoreRuntime,
		id: string,
		services: IChannelServices,
		attributes: IChannelAttributes,
	): Promise<MigrationShim<TOld, TNew>> {
		// assert check that the attributes match the old factory
		const migrationShim = new MigrationShim<TOld, TNew>(
			id,
			runtime,
			this.oldFactory,
			this.newFactory,
			this.populateNewChannelFn,
		);
		// the old shared object will need to be loaded here
		return migrationShim;
	}

	/**
	 * {@link @fluidframework/datastore-definitions#IChannelFactory.create}
	 *
	 * TODO: create documentation
	 */
	public create(runtime: IFluidDataStoreRuntime, id: string): MigrationShim<TOld, TNew> {
		const spanner = new MigrationShim<TOld, TNew>(
			id,
			runtime,
			this.oldFactory,
			this.newFactory,
			this.populateNewChannelFn,
		);
		// the old shared object will need to be loaded
		return spanner;
	}
}
