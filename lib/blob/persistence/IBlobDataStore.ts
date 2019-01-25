import * as Models from "../generated/artifacts/models";

export default interface IBlobDataStore {
  /**
   * Data store initial steps. Such as initial DB connections.
   *
   * @returns {Promise<void>}
   * @memberof IBlobDataStore
   */
  init(): Promise<void>;

  setServiceProperties<T>(serviceProperties: Models.StorageServiceProperties): Promise<T>;

  getServiceProperties(): Promise<Models.StorageServiceProperties>;

  createContainer<T>(container: Models.ContainerItem): Promise<T>;

  deleteContainer(container: string): Promise<void>;

  listContainers(prefix?: string, maxResults?: number): Promise<Models.ContainerItem[]>;

  /**
   * Data store close steps. Such as close DB connections.
   *
   * @returns {Promise<void>}
   * @memberof IBlobDataStore
   */
  close(): Promise<void>;
}
