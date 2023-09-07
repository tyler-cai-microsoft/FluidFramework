/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IMigrationQueue } from "./types";

// Essentially the goal is to pretend to be the service when processing ops.
export class MigrationQueue implements IMigrationQueue {
	private readonly actions: (() => void)[] = [];
	public push(action: () => void) {
		this.actions.push(action);
	}

	public process() {
		for (const action of this.actions) {
			action();
		}
	}
}
