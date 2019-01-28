import Loki from "lokijs";

import { ContainerItem } from "../generated/artifacts/models";
import * as Models from "../generated/artifacts/models";
import { LOKI_DB_PATH } from "../utils/constants";
import IBlobDataStore from "./IBlobDataStore";

/**
 * This is a simple sample of persistency layer data source.
 *
 * @export
 * @class SimpleDataStore
 */
export default class LokiBlobDataStore implements IBlobDataStore {
  public containers: { [key: string]: ContainerItem } = {};
  private readonly db: Loki;
  // private readonly lokiDBPath: string;

  private readonly CONTAINERS_COLLECTION = "$containers$";
  private readonly SERVICE_PROPERTIES_COLLECTION = "$serviceproperties$";

  private readonly defaultServiceProperties: Models.StorageServiceProperties = {
    cors: [],
    defaultServiceVersion: LOKI_DB_PATH, // Move it to constants.ts
    hourMetrics: {
      enabled: false,
      retentionPolicy: {
        enabled: false,
      },
      version: "1.0",
    },
    logging: {
      deleteProperty: true,
      read: true,
      retentionPolicy: {
        enabled: false,
      },
      version: "1.0",
      write: true,
    },
    minuteMetrics: {
      enabled: false,
      retentionPolicy: {
        enabled: false,
      },
      version: "1.0",
    },
    staticWebsite: {
      enabled: false,
    },
  };

  public constructor(
    lokiDBPath: string // private readonly logger: ILogger
  ) {
    // this.lokiDBPath = lokiDBPath;
    this.db = new Loki(lokiDBPath, {
      autosave: true,
      autosaveInterval: 5000,
    });
  }

  public async init(): Promise<void> {
    if (!this.db.getCollection(this.CONTAINERS_COLLECTION)) {
      this.db.addCollection(this.CONTAINERS_COLLECTION);
    }

    if (!this.db.getCollection(this.SERVICE_PROPERTIES_COLLECTION)) {
      this.db.addCollection(this.SERVICE_PROPERTIES_COLLECTION);
      await this.setServiceProperties(this.defaultServiceProperties);
    }
  }

  public async setServiceProperties<T>(
    serviceProperties: Models.StorageServiceProperties
  ): Promise<T> {
    const coll = this.db.getCollection(this.SERVICE_PROPERTIES_COLLECTION);
    const docs = coll.where(() => true);
    if (docs.length > 0) {
      coll.remove(docs[0]);
    }

    return coll.insert(serviceProperties);
  }

  public async getServiceProperties<T>(): Promise<T> {
    const coll = this.db.getCollection(this.SERVICE_PROPERTIES_COLLECTION);
    const doc = coll.where(() => true)[0];
    return doc;
  }

  public async createContainer<T>(container: Models.ContainerItem): Promise<T> {
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);
    this.db.addCollection(container.name);
    return coll.insert(container);
  }

  public async deleteContainer(container: string): Promise<void> {
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);
    coll
      .chain()
      .find({ name: { $eq: container } })
      .remove();

    // TODO: Remove all entities on disk
    // const entities = this.db
    //   .getCollection(container)
    //   .chain()
    //   .find({ name: { $contains: "" } })
    //   .data();
  }

  public async listContainers<T>(
    prefix: string = "",
    maxResults: number = 2000
  ): Promise<T[]> {
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);
    return coll
      .chain()
      .find({ name: { $regex: `^${prefix}` } })
      .simplesort("name")
      .limit(maxResults)
      .data();
  }

  public async close(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
