/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
	ISequencedDocumentMessage,
	ISummaryContent,
	IVersion,
	MessageType,
} from "@fluidframework/protocol-definitions";
import { Deferred, assert } from "@fluidframework/common-utils";
import {
	IBatchMessage,
	IContainerContext,
	IErrorBase,
	IFluidCodeDetails,
} from "@fluidframework/container-definitions";
import { IDocumentStorageService } from "@fluidframework/driver-definitions";
import { ContainerMessageType, ContainerRuntime } from "@fluidframework/container-runtime";
import { ITelemetryBaseLogger, FluidObject } from "@fluidframework/core-interfaces";
import { IMigrationQueue } from "./types";
import { MigrationQueue } from "./migratorQueue";

export class MigrationContainerContext implements IContainerContext {
	public queue: IMigrationQueue = new MigrationQueue();

	constructor(private readonly context: IContainerContext) {
		this.getSpecifiedCodeDetails = context.getSpecifiedCodeDetails?.bind(context) ?? undefined;
		this.getAbsoluteUrl = context.getAbsoluteUrl?.bind(context) ?? undefined;
	}

	// Honestly, not sure which number should be what, so I made them all the same.
	private _sequenceNumber?: number;
	private get sequenceNumber() {
		assert(
			this._sequenceNumber !== undefined,
			"_sequenceNumber should have been set before retrieval",
		);
		return this._sequenceNumber;
	}
	private _minimumSequenceNumber?: number;
	private get minimumSequenceNumber() {
		assert(
			this._minimumSequenceNumber !== undefined,
			"_minimumSequenceNumber should have been set before retrieval",
		);
		return this._minimumSequenceNumber;
	}
	private _clientSequenceNumber?: number;
	private get clientSequenceNumber() {
		assert(
			this._clientSequenceNumber !== undefined,
			"_clientSequenceNumber should have been set before retrieval",
		);
		return this._clientSequenceNumber;
	}
	private _referenceSequenceNumber?: number;
	private get referenceSequenceNumber() {
		assert(
			this._referenceSequenceNumber !== undefined,
			"_referenceSequenceNumber should have been set before retrieval",
		);
		return this._referenceSequenceNumber;
	}
	private _runtime?: ContainerRuntime;
	private get runtime(): ContainerRuntime {
		assert(this._runtime !== undefined, "runtime needs to be set before retrieving this");
		return this._runtime;
	}
	private migrationOn: boolean = false;
	private minimumSequenceNumberForPause?: number;
	private readonly waitForPause: Deferred<void> = new Deferred();

	public async startMigration() {
		this.runtime.submitMigrateOp();
		await this.waitForPause.promise;
		this._sequenceNumber = this.context.deltaManager.lastSequenceNumber;
		this._minimumSequenceNumber = this.context.deltaManager.lastSequenceNumber;
		this._clientSequenceNumber = this.context.deltaManager.lastSequenceNumber;
		this._referenceSequenceNumber = this.context.deltaManager.lastSequenceNumber;
		this.migrationOn = true;
	}

	// The runtime needs to be passed the context first, so once it's created, we pass back the runtime.
	public setRuntime(runtime: ContainerRuntime) {
		this._runtime = runtime;
		runtime.on("op", (op) => {
			if (op.type === ContainerMessageType.StartMigration) {
				this.minimumSequenceNumberForPause = op.sequenceNumber;
			}
			if (
				this.minimumSequenceNumberForPause !== undefined &&
				this.context.deltaManager.minimumSequenceNumber <=
					this.minimumSequenceNumberForPause
			) {
				this.waitForPause.resolve();
				runtime.off("op", () => {});
			}
		});
	}

	// Added this queue so that the local message would be processed properly
	public async submitMigrationSummary() {
		this.runtime.flush();
		this.queue.process();
		assert(
			this.deltaManager.lastKnownSeqNumber === this.sequenceNumber,
			"Delta manager should not have processed any ops!",
		);
		const summarizeResult = this.runtime.summarizeOnDemand({ reason: "migration" });
		const ackOrNackResult = await summarizeResult.receivedSummaryAckOrNack;
		if (!ackOrNackResult.success) {
			throw new Error("failed to summarize result!");
		}
		this.runtime.closeFn();
		this.runtime.disposeFn();
		return summarizeResult;
	}

	// I don't think we use this, but I overwrote it just in case
	submitFn: (type: MessageType, contents: any, batch: boolean, appData?: any) => number = (
		type,
		contents,
		batch,
		appData,
	) => {
		if (!this.migrationOn) {
			return this.context.submitFn(type, contents, batch, appData);
		}

		this.queue.push(() => {
			const message: ISequencedDocumentMessage = {
				clientId: this.runtime.clientId ?? "",
				sequenceNumber: this.sequenceNumber,
				term: undefined,
				minimumSequenceNumber: this.minimumSequenceNumber,
				clientSequenceNumber: this.clientSequenceNumber,
				referenceSequenceNumber: this.referenceSequenceNumber,
				type,
				contents,
				timestamp: 0, // Seems like something important to discuss especially in terms of GC
			};
			this.runtime.process(message, true);
		});

		return this.clientSequenceNumber;
	};

	// This method should be looked at.
	submitBatchFn: (
		batch: IBatchMessage[],
		referenceSequenceNumber?: number | undefined,
	) => number = (batch, referenceSequenceNumber) => {
		if (!this.migrationOn) {
			return this.context.submitBatchFn(batch, referenceSequenceNumber);
		}
		this.queue.push(() => {
			for (const batchMessage of batch) {
				const message: ISequencedDocumentMessage = {
					clientId: this.runtime.clientId ?? "",
					sequenceNumber: this.sequenceNumber,
					term: undefined,
					minimumSequenceNumber: this.minimumSequenceNumber,
					clientSequenceNumber: this.clientSequenceNumber,
					referenceSequenceNumber: this.referenceSequenceNumber,
					type: MessageType.Operation,
					contents: batchMessage.contents,
					timestamp: 0, // Seems like something important to discuss especially in terms of GC
				};
				this.runtime.process(message, true);
			}
		});
		return this.clientSequenceNumber;
	};

	// All these should be whatever the context originally returns
	public get options() {
		return this.context.options;
	}
	public get id() {
		return this.context.id;
	}
	public get clientId() {
		return this.context.clientId;
	}
	public get clientDetails() {
		return this.context.clientDetails;
	}
	public get storage(): IDocumentStorageService {
		return this.context.storage;
	}
	public get connected() {
		return this.context.connected;
	}
	public get baseSnapshot() {
		return this.context.baseSnapshot;
	}
	submitSummaryFn: (
		summaryOp: ISummaryContent,
		referenceSequenceNumber?: number | undefined,
	) => number = this.context.submitSummaryFn;
	submitSignalFn: (contents: any) => void = this.context.submitSignalFn;
	disposeFn?: ((error?: IErrorBase | undefined) => void) | undefined = this.context.disposeFn;
	closeFn: (error?: IErrorBase | undefined) => void = this.context.closeFn;
	public get deltaManager() {
		return this.context.deltaManager;
	}
	public get quorum() {
		return this.context.quorum;
	}
	public getSpecifiedCodeDetails?: () => IFluidCodeDetails | undefined;
	public get audience() {
		return this.context.audience;
	}
	public get loader() {
		return this.context.loader;
	}
	public get taggedLogger(): ITelemetryBaseLogger {
		return this.context.taggedLogger;
	}
	public get pendingLocalState() {
		return this.context.pendingLocalState;
	}
	public get scope(): FluidObject {
		return this.context.scope;
	}
	public getAbsoluteUrl?: (relativeUrl: string) => Promise<string | undefined>;
	public get attachState() {
		return this.context.attachState;
	}
	public getLoadedFromVersion: () => IVersion | undefined = () => {
		return this.context.getLoadedFromVersion();
	};
	public updateDirtyContainerState: (dirty: boolean) => void = (dirty: boolean) => {
		return this.context.updateDirtyContainerState(dirty);
	};
	public get supportedFeatures() {
		return this.context.supportedFeatures;
	}
}
