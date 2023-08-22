/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// Not sure how/if we should change the FluidDataStoreContext
// Note pkg is protected under FluidDataStoreContext.
export interface IModifiableFluidDataStoreContext {
	pkg?: readonly string[];
}

export interface IMigrationQueue {
	push(action: () => void): void;
	process(): void;
}
