/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedDirectory } from "@fluidframework/map";
import { DataObject } from "@fluidframework/aqueduct";
import { IModifiableFluidDataStoreContext } from "./types";

/**
 * The concept of this class is to scope changes only necessary to data migration here.
 *
 * There's a vein of thought to put the migration code here, where it extends the MigrationDataObject.
 * Another thought is to party on the whole document. We'll need both solutions, so this is one way of doing it.
 */
export class MigratorDataObject extends DataObject {
	public get _root(): ISharedDirectory {
		return this.root;
	}

	// Not sure if this is the right place for it
	public changeType(pkg: readonly string[]) {
		const context = this.context as unknown as IModifiableFluidDataStoreContext;
		context.pkg = pkg;
	}

	// Further improvements: Add delete/replace dds functionality
}
