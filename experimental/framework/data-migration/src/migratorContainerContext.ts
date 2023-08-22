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
import { assert } from "@fluidframework/common-utils";
import {
	IBatchMessage,
	IContainerContext,
	IErrorBase,
	IFluidCodeDetails,
} from "@fluidframework/container-definitions";
import { IDocumentStorageService } from "@fluidframework/driver-definitions";
import { ContainerRuntime } from "@fluidframework/container-runtime";
import { ITelemetryBaseLogger, FluidObject } from "@fluidframework/core-interfaces";
import { IMigrationQueue } from "./types";
import { MigrationQueue } from "./migratorQueue";

export class MigrationContainerContext implements IContainerContext {
	public migrationOn: boolean = false;
	public queue: IMigrationQueue = new MigrationQueue();
	constructor(private readonly context: IContainerContext) {
		this.sequenceNumber = context.deltaManager.lastSequenceNumber;
		this.minimumSequenceNumber = context.deltaManager.lastSequenceNumber;
		this.clientSequenceNumber = context.deltaManager.lastSequenceNumber;
		this.referenceSequenceNumber = context.deltaManager.lastSequenceNumber;
		this.getSpecifiedCodeDetails = context.getSpecifiedCodeDetails?.bind(context) ?? undefined;
		this.getAbsoluteUrl = context.getAbsoluteUrl?.bind(context) ?? undefined;
	}

	// Honestly, not sure which number should be what, so I made them all the same.
	private readonly sequenceNumber: number;
	private readonly minimumSequenceNumber: number;
	private readonly clientSequenceNumber: number;
	private readonly referenceSequenceNumber: number;
	private _runtime?: ContainerRuntime;
	private get runtime(): ContainerRuntime {
		assert(this._runtime !== undefined, "runtime needs to be set before retrieving this");
		return this._runtime;
	}

	// The runtime needs to be passed the context first, so once it's created, we pass back the runtime.
	public setRuntime(runtime: ContainerRuntime) {
		this._runtime = runtime;
	}

	// Added this queue so that the local message would be processed properly
	public process() {
		this.queue.process();
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
