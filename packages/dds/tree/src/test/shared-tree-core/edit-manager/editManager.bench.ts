/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { benchmark, BenchmarkTimer, BenchmarkType } from "@fluid-tools/benchmark";
import { NoOpChangeRebaser, TestChange, testChangeFamilyFactory } from "../../testChange.js";
import { ChangeFamily, rootFieldKey } from "../../../core/index.js";
import { Commit } from "../../../shared-tree-core/index.js";
import { DefaultChangeFamily } from "../../../feature-libraries/index.js";
import { noopValidator } from "../../../codec/index.js";
import { singleJsonCursor } from "../../../domains/index.js";
import { brand } from "../../../util/index.js";
import { Editor, makeEditMinter } from "../../editMinter.js";
import { failCodec, mintRevisionTag, testRevisionTagCodec } from "../../utils.js";
import {
	rebaseAdvancingPeerEditsOverTrunkEdits,
	rebaseConcurrentPeerEdits,
	rebaseLocalEditsOverTrunkEdits,
	rebasePeerEditsOverTrunkEdits,
	editManagerFactory,
} from "./editManagerTestUtils.js";

describe("EditManager - Bench", () => {
	interface Scenario {
		readonly type: BenchmarkType;
		readonly rebasedEditCount: number;
		readonly trunkEditCount: number;
	}

	const scenarios: Scenario[] = [
		{ type: BenchmarkType.Perspective, rebasedEditCount: 1, trunkEditCount: 1 },
		{ type: BenchmarkType.Perspective, rebasedEditCount: 10, trunkEditCount: 1 },
		{ type: BenchmarkType.Perspective, rebasedEditCount: 100, trunkEditCount: 1 },
		{ type: BenchmarkType.Perspective, rebasedEditCount: 1000, trunkEditCount: 1 },
		{ type: BenchmarkType.Perspective, rebasedEditCount: 1, trunkEditCount: 10 },
		{ type: BenchmarkType.Perspective, rebasedEditCount: 1, trunkEditCount: 100 },
		{ type: BenchmarkType.Perspective, rebasedEditCount: 1, trunkEditCount: 1000 },
		{ type: BenchmarkType.Measurement, rebasedEditCount: 100, trunkEditCount: 100 },
	];

	interface Family<TChange> {
		readonly name: string;
		readonly changeFamily: ChangeFamily<any, TChange>;
		readonly mintChange: () => TChange;
		readonly maxEditCount: number;
	}

	const defaultFamily = new DefaultChangeFamily(testRevisionTagCodec, failCodec, {
		jsonValidator: noopValidator,
	});
	const sequencePrepend: Editor = (builder) => {
		builder
			.sequenceField({ parent: undefined, field: rootFieldKey })
			.insert(0, singleJsonCursor(1));
	};

	const families: Family<any>[] = [
		{
			name: "TestChange",
			changeFamily: testChangeFamilyFactory(new NoOpChangeRebaser()),
			mintChange: () => TestChange.emptyChange,
			maxEditCount: Number.POSITIVE_INFINITY,
		},
		{
			name: "Default - Sequence Insert",
			changeFamily: defaultFamily,
			mintChange: makeEditMinter(defaultFamily, sequencePrepend),
			maxEditCount: 350,
		},
	];
	for (const family of families) {
		describe(`family: ${family.name}`, () => {
			describe("Local commit rebasing", () => {
				for (const { type, rebasedEditCount, trunkEditCount } of scenarios) {
					if (rebasedEditCount * trunkEditCount > family.maxEditCount) {
						continue;
					}
					benchmark({
						type,
						title: `Rebase ${rebasedEditCount} local commits over ${trunkEditCount} trunk commits`,
						benchmarkFnCustom: async <T>(state: BenchmarkTimer<T>) => {
							let duration: number;
							do {
								// Since this setup one collects data from one iteration, assert that this is what is expected.
								assert.equal(state.iterationsPerBatch, 1);

								// Setup
								const manager = editManagerFactory(family.changeFamily);
								const rebasing = rebaseLocalEditsOverTrunkEdits(
									rebasedEditCount,
									trunkEditCount,
									manager,
									family.mintChange,
									true,
								);

								// Measure
								const before = state.timer.now();
								rebasing();
								const after = state.timer.now();
								duration = state.timer.toSeconds(before, after);
								// Collect data
							} while (state.recordBatch(duration));
						},
						// Force batch size of 1
						minBatchDurationSeconds: 0,
					});
				}
			});
			describe("Peer commit rebasing (fix ref seq#)", () => {
				for (const { type, rebasedEditCount: peerEditCount, trunkEditCount } of scenarios) {
					if (peerEditCount * trunkEditCount > family.maxEditCount) {
						continue;
					}
					benchmark({
						type,
						title: `Receive ${peerEditCount} peer commits that need to be rebased over ${trunkEditCount} trunk commits`,
						benchmarkFnCustom: async <T>(state: BenchmarkTimer<T>) => {
							let duration: number;
							do {
								// Since this setup one collects data from one iteration, assert that this is what is expected.
								assert.equal(state.iterationsPerBatch, 1);

								// Setup
								const manager = editManagerFactory(family.changeFamily);
								const rebasing = rebasePeerEditsOverTrunkEdits(
									peerEditCount,
									trunkEditCount,
									manager,
									family.mintChange,
									true,
								);

								// Measure
								const before = state.timer.now();
								rebasing();
								const after = state.timer.now();
								duration = state.timer.toSeconds(before, after);
								// Collect data
							} while (state.recordBatch(duration));
						},
						// Force batch size of 1
						minBatchDurationSeconds: 0,
					});
				}
			});
			describe("Peer commit rebasing (advancing ref seq#)", () => {
				for (const { type, editCount } of [
					{ type: BenchmarkType.Perspective, editCount: 1 },
					{ type: BenchmarkType.Perspective, editCount: 10 },
					{ type: BenchmarkType.Measurement, editCount: 100 },
				]) {
					if (editCount ** 2 > family.maxEditCount) {
						continue;
					}
					benchmark({
						type,
						title: `for ${editCount} peer commits and ${editCount} trunk commits`,
						benchmarkFnCustom: async <T>(state: BenchmarkTimer<T>) => {
							let duration: number;
							do {
								// Since this setup one collects data from one iteration, assert that this is what is expected.
								assert.equal(state.iterationsPerBatch, 1);

								// Setup
								const manager = editManagerFactory(family.changeFamily);
								const rebasing = rebaseAdvancingPeerEditsOverTrunkEdits(
									editCount,
									manager,
									family.mintChange,
									true,
								);

								// Measure
								const before = state.timer.now();
								rebasing();
								const after = state.timer.now();
								duration = state.timer.toSeconds(before, after);
								// Collect data
							} while (state.recordBatch(duration));
						},
						// Force batch size of 1
						minBatchDurationSeconds: 0,
					});
				}
			});
			describe("Multi-peer commit rebasing", () => {
				interface MultiPeerScenario {
					readonly type: BenchmarkType;
					readonly peerCount: number;
					readonly editsPerPeerCount: number;
				}

				const multiPeerScenarios: MultiPeerScenario[] = [
					{ type: BenchmarkType.Perspective, peerCount: 10, editsPerPeerCount: 10 },
					{ type: BenchmarkType.Perspective, peerCount: 10, editsPerPeerCount: 20 },
					{ type: BenchmarkType.Perspective, peerCount: 20, editsPerPeerCount: 10 },
					{ type: BenchmarkType.Measurement, peerCount: 20, editsPerPeerCount: 20 },
				];
				for (const { type, peerCount, editsPerPeerCount } of multiPeerScenarios) {
					if (peerCount * editsPerPeerCount > family.maxEditCount) {
						continue;
					}
					benchmark({
						type,
						title: `Rebase edits from ${peerCount} peers each sending ${editsPerPeerCount} commits`,
						benchmarkFnCustom: async <T>(state: BenchmarkTimer<T>) => {
							let duration: number;
							do {
								// Since this setup one collects data from one iteration, assert that this is what is expected.
								assert.equal(state.iterationsPerBatch, 1);

								// Setup
								const manager = editManagerFactory(family.changeFamily);
								const rebasing = rebaseConcurrentPeerEdits(
									peerCount,
									editsPerPeerCount,
									manager,
									family.mintChange,
									true,
								);

								// Measure
								const before = state.timer.now();
								rebasing();
								const after = state.timer.now();
								duration = state.timer.toSeconds(before, after);
								// Collect data
							} while (state.recordBatch(duration));
						},
						// Force batch size of 1
						minBatchDurationSeconds: 0,
					});
				}
			});
		});
	}

	describe("No concurrency", () => {
		describe("Many local edits", () => {
			for (const [type, count] of [
				[BenchmarkType.Perspective, 1],
				[BenchmarkType.Perspective, 10],
				[BenchmarkType.Perspective, 100],
				[BenchmarkType.Perspective, 1000],
			]) {
				benchmark({
					type,
					title: `Process the sequencing of ${count} local commits`,
					benchmarkFnCustom: async <T>(state: BenchmarkTimer<T>) => {
						let duration: number;
						do {
							// Since this setup one collects data from one iteration, assert that this is what is expected.
							assert.equal(state.iterationsPerBatch, 1);

							// Setup
							const family = testChangeFamilyFactory(new NoOpChangeRebaser());
							const manager = editManagerFactory(family);
							// Subscribe to the local branch to emulate the behavior of SharedTree
							manager.localBranch.on("afterChange", ({ change }) => {});
							const sequencedEdits: Commit<TestChange>[] = [];
							for (let iChange = 0; iChange < count; iChange++) {
								const revision = mintRevisionTag();
								manager.localBranch.apply(TestChange.emptyChange, revision);
								sequencedEdits.push({
									change: TestChange.emptyChange,
									revision,
									sessionId: manager.localSessionId,
								});
							}

							// Measure
							const before = state.timer.now();
							for (let iChange = 0; iChange < count; iChange++) {
								manager.addSequencedChange(
									sequencedEdits[iChange],
									brand(iChange + 1),
									brand(0),
								);
							}
							const after = state.timer.now();
							duration = state.timer.toSeconds(before, after);
							// Collect data
						} while (state.recordBatch(duration));
					},
					// Force batch size of 1
					minBatchDurationSeconds: 0,
				});
			}
		});
	});
});
