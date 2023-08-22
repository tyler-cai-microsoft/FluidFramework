/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { Deferred } from "@fluidframework/common-utils";
import {
	IContainerContext,
	IRuntime,
	IRuntimeFactory,
} from "@fluidframework/container-definitions";
import { ContainerRuntime, summarizerClientType } from "@fluidframework/container-runtime";
import { MigrationContainerContext } from "./migratorContainerContext";

interface IContainerRuntimeFactory extends IRuntimeFactory {
	instantiateRuntime(context: IContainerContext, existing: boolean): Promise<ContainerRuntime>;
}

// This api needs to be adjusted. Not sure exactly what the right one looks like.
export class ContainerRuntimeFactoryManager implements IRuntimeFactory {
	private clientDetailsType?: string;
	private readonly waitForSummarizerCreation = new Deferred<ContainerRuntime>();
	private readonly waitForMigrationContext = new Deferred<MigrationContainerContext>();
	public get summarizerRuntime() {
		return this.waitForSummarizerCreation.promise;
	}

	public get migrationContext() {
		return this.waitForMigrationContext.promise;
	}
	public get IRuntimeFactory(): IRuntimeFactory {
		return this;
	}

	constructor(
		private readonly runtimeFactory: IRuntimeFactory,
		private readonly migrationRuntimeFactory: IContainerRuntimeFactory,
	) {}
	public async instantiateRuntime(
		context: IContainerContext,
		existing: boolean,
	): Promise<IRuntime> {
		this.clientDetailsType = context.clientDetails.type;
		if (this.clientDetailsType === summarizerClientType) {
			const migrationContext = new MigrationContainerContext(context);
			const runtime = await this.migrationRuntimeFactory.instantiateRuntime(
				migrationContext,
				existing,
			);
			migrationContext.setRuntime(runtime);
			this.waitForMigrationContext.resolve(migrationContext);
			this.waitForSummarizerCreation.resolve(runtime);
			return runtime;
		}

		return this.runtimeFactory.instantiateRuntime(context, existing);
	}
}
