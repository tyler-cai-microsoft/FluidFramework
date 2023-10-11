/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { TypedEventEmitter } from "@fluid-internal/client-utils";
import {
	type IEvent,
	type IFluidHandle,
	type IFluidLoadable,
} from "@fluidframework/core-interfaces";
import {
	type IChannelAttributes,
	type IChannel,
	type IChannelServices,
	type IFluidDataStoreRuntime,
} from "@fluidframework/datastore-definitions";
import {
	type IExperimentalIncrementalSummaryContext,
	type IGarbageCollectionData,
	type ITelemetryContext,
	type ISummaryTreeWithStats,
} from "@fluidframework/runtime-definitions";
import {
	type SharedTreeFactory as LegacySharedTreeFactory,
	type SharedTree as LegacySharedTree,
} from "@fluid-experimental/tree";
import { type SharedTreeFactory, type ISharedTree } from "@fluid-experimental/tree2";
import { assert } from "@fluidframework/core-utils";
/**
 * Interface for migration events.
 */
export interface IMigrationEvent extends IEvent {
	/**
	 * Event that is emitted when the migration is complete.
	 */
	(event: "migrated", listener: () => void);
}

/**
 * Interface for migration operation.
 */
export interface IMigrationOp {
	/**
	 * Type of the migration operation.
	 */
	type: "hotSwap";
	/**
	 * Old channel attributes.
	 */
	oldAttributes: IChannelAttributes;
	/**
	 * New channel attributes.
	 */
	newAttributes: IChannelAttributes;
}

/**
 * Create skeleton Migration Shim that can hot swap from one DDS to a new DDS.
 */
export class MigrationShim extends TypedEventEmitter<IMigrationEvent> implements IChannel {
	public constructor(
		public readonly id: string,
		private readonly runtime: IFluidDataStoreRuntime,
		private readonly legacyTreeFactory: LegacySharedTreeFactory,
		private readonly newTreeFactory: SharedTreeFactory,
		private readonly populateNewSharedObjectFn: (
			legacyTree: LegacySharedTree,
			newTree: ISharedTree,
		) => void,
	) {
		super();
	}

	private _legacyTree: LegacySharedTree | undefined;
	private get legacyTree(): LegacySharedTree {
		assert(this._legacyTree !== undefined, "Old tree not initialized");
		return this._legacyTree;
	}

	// This is the magic button that tells this Spanner and all other Spanners to swap to the new Shared Object.
	public submitMigrateOp(): void {
		// These console logs are for compilation purposes
		console.log(this.runtime);
		console.log(this.legacyTreeFactory);
		console.log(this.newTreeFactory);
		console.log(this.populateNewSharedObjectFn);
		throw new Error("Method not implemented.");
	}

	public get currentTree(): LegacySharedTree | ISharedTree {
		return this.legacyTree;
	}

	public async load(services: IChannelServices): Promise<void> {
		this._legacyTree = (await this.legacyTreeFactory.load(
			this.runtime,
			this.id,
			services,
			this.legacyTreeFactory.attributes,
		)) as LegacySharedTree;
	}
	public create(): void {
		this._legacyTree = this.legacyTreeFactory.create(this.runtime, this.id);
	}

	public attributes!: IChannelAttributes;
	public getAttachSummary(
		fullTree?: boolean | undefined,
		trackState?: boolean | undefined,
		telemetryContext?: ITelemetryContext | undefined,
	): ISummaryTreeWithStats {
		throw new Error("Method not implemented.");
	}
	public async summarize(
		fullTree?: boolean | undefined,
		trackState?: boolean | undefined,
		telemetryContext?: ITelemetryContext | undefined,
		incrementalSummaryContext?: IExperimentalIncrementalSummaryContext | undefined,
	): Promise<ISummaryTreeWithStats> {
		throw new Error("Method not implemented.");
	}
	public isAttached(): boolean {
		throw new Error("Method not implemented.");
	}
	public connect(services: IChannelServices): void {
		throw new Error("Method not implemented.");
	}
	public getGCData(fullGC?: boolean | undefined): IGarbageCollectionData {
		throw new Error("Method not implemented.");
	}
	public handle!: IFluidHandle;
	public IFluidLoadable!: IFluidLoadable;
}
