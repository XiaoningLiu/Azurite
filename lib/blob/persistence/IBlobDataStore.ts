export interface IContainer {
  name: string;
}

export interface IBlobDataStore {
  /**
   * Data store initial steps. Such as initial DB connections.
   *
   * @returns {Promise<void>}
   * @memberof IBlobDataStore
   */
  init(): Promise<void>;

  setServiceProperties<T>(serviceProperties: T): Promise<T>;

  getServiceProperties<T>(): Promise<T>;

  createContainer<T extends IContainer>(container: T): Promise<T>;

  getContainer<T>(container: string): Promise<T>;

  deleteContainer(container: string): Promise<void>;

  updateContainer<T extends IContainer>(container: T): Promise<T>;

  listContainers<T>(prefix?: string, maxResults?: number): Promise<T[]>;

  /**
   * Data store close steps. Such as close DB connections.
   *
   * @returns {Promise<void>}
   * @memberof IBlobDataStore
   */
  close(): Promise<void>;
}

export default IBlobDataStore;
