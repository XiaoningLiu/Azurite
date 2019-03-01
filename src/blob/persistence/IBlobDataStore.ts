import * as Models from "../generated/artifacts/models";
import { IDataStore } from "./IDataStore";

export interface IBlobDataStore extends IDataStore {
  setServiceProperties<T extends Models.StorageServiceProperties>(
    serviceProperties: T
  ): Promise<T>;

  getServiceProperties<T extends Models.StorageServiceProperties>(): Promise<T>;

  getContainer<T extends Models.ContainerItem>(container: string): Promise<T | undefined>;

  deleteContainer(container: string): Promise<void>;

  updateContainer<T extends Models.ContainerItem>(container: T): Promise<T>;

  listContainers<T extends Models.ContainerItem>(
    prefix?: string,
    maxResults?: number,
    marker?: number
  ): Promise<[T[], number | undefined]>;

  updateBlob<T extends Models.BlobItem>(container: string, blob: T): Promise<T>;

  getBlob<T extends Models.BlobItem>(container: string, blob: string): Promise<T | undefined>;

  deleteBlob(container: string, blob: string): Promise<void>;

  writeBlobPayload(
    container: string,
    blob: string,
    payload: NodeJS.ReadableStream
  ): Promise<void>;

  readBlobPayload(container: string, blob: string): Promise<NodeJS.ReadableStream>;
}

export default IBlobDataStore;
