/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { assert } from "@fluidframework/common-utils";
import { SummaryType } from "@fluidframework/protocol-definitions";
import { ISummarizeResult } from "@fluidframework/runtime-definitions";
import { mergeStats } from "../summaryUtils";

export class ChangeNode {
	constructor(private _changeSequenceNumber: number) {}

	public invalidate(sequenceNumber: number): void {
		if (sequenceNumber > this._changeSequenceNumber) {
			this._changeSequenceNumber = sequenceNumber;
		}
	}

	public hasChanged(referenceSequenceNumber: number): boolean {
		return this._changeSequenceNumber > referenceSequenceNumber;
	}

	public async generateSummaryHandle(
		fullTree: boolean,
		referenceSequenceNumber: number,
		path: string,
	): Promise<ISummarizeResult> {
		assert(!fullTree, "Shouldn't be generating a handle when doing a full tree summarization");
		assert(
			!this.hasChanged(referenceSequenceNumber),
			"Shouldn't be generating a handle there are new changes since the last summary",
		);

		const stats = mergeStats();
		stats.handleNodeCount++;
		return {
			summary: {
				type: SummaryType.Handle,
				handle: path,
				handleType: SummaryType.Tree,
			},
			stats,
		};
	}
}
