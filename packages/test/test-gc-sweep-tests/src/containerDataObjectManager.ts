import { strict as assert } from "assert";
import { IContainer } from "@fluidframework/container-definitions";
import { IFluidHandle, IFluidRouter } from "@fluidframework/core-interfaces";
import { requestFluidObject } from "@fluidframework/runtime-utils";
import Random from "random-js";
import { IRemovedHandle } from "./channelHandler";
import { IChannelPath } from "./handlesTracker";
import { DataObjectManyDDSes } from "./testDataObjects";
import { IFluidObjectPath } from "./fluidObjectTracker";

export class ContainerDataObjectManager {
	private readonly dataStoreType: string = DataObjectManyDDSes.type;

	constructor(private readonly container: IContainer) {}

	public async getDataObject(dataStoreId: string): Promise<DataObjectManyDDSes> {
		return this.getDataObjectFromRoute(this.container, dataStoreId);
	}

	public async createDataObject(): Promise<DataObjectManyDDSes> {
		const defaultDataStore = await this.getDataObjectFromRoute(this.container, "default");
        const newDataStore = await defaultDataStore.containerRuntime.createDataStore(this.dataStoreType);
        const newDataObject = await this.getDataObjectFromRoute(newDataStore, "");
        return newDataObject;
	}

	public async getHandle(handlePath: IFluidObjectPath): Promise<IFluidHandle> {
		const dataObject = await this.getDataObjectFromRoute(this.container, `/${handlePath.dataStoreId}`);
		if (handlePath.ddsId === undefined) {
			return dataObject.handle;
		}
		const handle = dataObject._root.get<IFluidHandle>(handlePath.ddsId);
		assert(handle !== undefined, "Handle should exist in handle path! And it should be retrievable!");
		return handle;
	}

	public async addHandle(channelPath: IChannelPath, handle: IFluidHandle, random: Random) {
		const dataObject = await this.getDataObjectFromRoute(this.container, channelPath.dataStoreId);
		return dataObject.addHandleOpForChannel(channelPath.ddsId, handle, random);
	}

	public async removeHandle(handlePath: IChannelPath, random: Random): Promise<IRemovedHandle> {
		const dataObject = await this.getDataObjectFromRoute(this.container, handlePath.dataStoreId);
		return dataObject.removeHandleForChannel(handlePath.ddsId, random);
	}

    private async getDataObjectFromRoute(router: IFluidRouter, route: string) {
        const dataObject = await requestFluidObject<DataObjectManyDDSes>(router, route);
        return dataObject;
    }
}
