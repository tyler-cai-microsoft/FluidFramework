/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IRuntimeFactory } from "@fluidframework/container-definitions";
import { ISummarizerNodeWithGC } from "@fluidframework/runtime-definitions";

// Not sure how/if we should change the FluidDataStoreContext
// Note pkg is protected under FluidDataStoreContext.
export interface IModifiableFluidDataStoreContext {
	pkg?: readonly string[];
	summarizerNode: ISummarizerNodeWithGC;
}

export interface IMigrationQueue {
	push(action: () => void): void;
	process(): void;
}

export interface IMigratorDetectorRuntimeFactory extends IRuntimeFactory {
	readonly shouldMigrate: boolean;
}
