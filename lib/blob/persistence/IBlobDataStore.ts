import * as Models from "../generated/artifacts/models";
import { IDataStore } from "./IDataStore";

export interface IBlobDataStore extends IDataStore {
  setServiceProperties<T extends Models.StorageServiceProperties>(
    serviceProperties: T
  ): Promise<T>;

  getServiceProperties<T extends Models.StorageServiceProperties>(): Promise<T>;

  createContainer<T extends Models.ContainerItem>(container: T): Promise<T>;

  getContainer<T extends Models.ContainerItem>(container: string): Promise<T | undefined>;

  deleteContainer(container: string): Promise<void>;

  updateContainer<T extends Models.ContainerItem>(container: T): Promise<T>;

  listContainers<T extends Models.ContainerItem>(
    prefix?: string,
    maxResults?: number,
    marker?: number
  ): Promise<[T[], number | undefined]>;

  createBlob<T extends Models.BlobItem>(blob: T, container: string): Promise<T>;

  writeBlobData(
    container: string,
    blob: string,
    data: NodeJS.ReadableStream
  ): Promise<void>;
}

export default IBlobDataStore;
