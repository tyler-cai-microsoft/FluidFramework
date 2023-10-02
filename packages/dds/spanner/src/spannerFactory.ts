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
import { DataProcessingError } from "@fluidframework/telemetry-utils";
import { SharedObject } from "@fluidframework/shared-object-base";
import { Spanner } from "./spanner";
import { SpannerChannelServices } from "./spannerChannelServices";
import { attributesMatch } from "./utils";

/**
 * {@link @fluidframework/datastore-definitions#IChannelFactory} for {@link Spanner}.
 *
 * @sealed
 */
export class SpannerFactory<TOld extends SharedObject, TNew extends SharedObject>
	implements IChannelFactory
{
	public constructor(
		private readonly oldFactory: IChannelFactory,
		private readonly newFactory: IChannelFactory,
	) {}

	/**
	 * {@inheritDoc @fluidframework/datastore-definitions#IChannelFactory."type"}
	 */
	public get type(): string {
		return this.oldFactory.type;
	}

	/**
	 * {@inheritDoc @fluidframework/datastore-definitions#IChannelFactory.attributes}
	 */
	public get attributes(): IChannelAttributes {
		return this.oldFactory.attributes;
	}

	/**
	 * {@inheritDoc @fluidframework/datastore-definitions#IChannelFactory.load}
	 */
	public async load(
		runtime: IFluidDataStoreRuntime,
		id: string,
		services: IChannelServices,
		attributes: IChannelAttributes,
	): Promise<Spanner<TOld, TNew>> {
		// delta connection intercept generated here
		const spannerServices = new SpannerChannelServices(services);

		// who should do the loading? For now I'll do it here
		let oldChannel: TOld | undefined;
		let newChannel: TNew | undefined;
		if (attributesMatch(attributes, this.oldFactory.attributes)) {
			oldChannel = (await this.oldFactory.load(
				runtime,
				id,
				spannerServices,
				attributes,
			)) as TOld;
		} else if (attributesMatch(attributes, this.newFactory.attributes)) {
			newChannel = (await this.newFactory.load(
				runtime,
				id,
				spannerServices,
				attributes,
			)) as TNew;
		} else {
			throw DataProcessingError.create(
				"Channel attributes do not match either factory",
				"SpannerFactory.load",
			);
		}
		const channelSwap = new Spanner<TOld, TNew>(
			id,
			runtime,
			this.newFactory,
			oldChannel,
			newChannel,
		);
		channelSwap.load(spannerServices, channelSwap.migrate);
		return channelSwap;
	}

	/**
	 * {@inheritDoc @fluidframework/datastore-definitions#IChannelFactory.create}
	 */
	public create(runtime: IFluidDataStoreRuntime, id: string): Spanner<TOld, TNew> {
		const oldChannel = this.oldFactory.create(runtime, id) as TOld;
		return new Spanner<TOld, TNew>(id, runtime, this.newFactory, oldChannel);
	}
}
