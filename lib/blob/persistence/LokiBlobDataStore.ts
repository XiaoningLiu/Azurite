import { createWriteStream, stat } from "fs";
import Loki from "lokijs";
import { join } from "path";

import * as Models from "../generated/artifacts/models";
import { API_VERSION } from "../utils/constants";
import { IBlobDataStore } from "./IBlobDataStore";

// function cloneToDoc<T extends any>(doc: T, updated: T) {
//   for (const key in updated) {
//     if (updated.hasOwnProperty(key)) {
//       const element = updated[key];
//       doc.key = element;
//     }
//   }
// }

/**
 * This is a persistency layer data source implementation based on loki DB.
 *
 * Loki DB includes following collections and documents
 * -- SERVICE_PROPERTIES_COLLECTION // Collection contains service properties
 *                                  // Only 1 document
 * -- CONTAINERS_COLLECTION // Collection contains all container items
 *                          // Each document maps to 1 container
 *                          // Unique name
 * -- CONTAINER_COLLECTION // Every container maps to a container collection
 *                         // Container collection contains all blobs under a container
 *                         // Each document maps to 1 blob
 *                         // Unique name
 *
 * @export
 * @class LokiBlobDataStore
 */
export default class LokiBlobDataStore implements IBlobDataStore {
  private readonly db: Loki;

  private readonly CONTAINERS_COLLECTION = "$containers$";
  private readonly SERVICE_PROPERTIES_COLLECTION = "$serviceproperties$";

  private SERVICE_PROPERTIES_DOCUMENT_LOKI_ID?: number;

  private readonly defaultServiceProperties = {
    cors: [],
    defaultServiceVersion: API_VERSION,
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
    private readonly lokiDBPath: string,
    private readonly persistencePath: string // private readonly logger: ILogger
  ) {
    this.db = new Loki(lokiDBPath, {
      autosave: true,
      autosaveInterval: 5000,
    });
  }

  public async init(): Promise<void> {
    // TODO: Native Promise doesn't have promisifyAll method. Create it as utility manually
    await new Promise<void>((resolve, reject) => {
      stat(this.lokiDBPath, (statError, stats) => {
        if (!statError) {
          this.db.loadDatabase({}, (dbError) => {
            if (dbError) {
              reject(dbError);
            } else {
              resolve();
            }
          });
        } else {
          // when DB file doesn't exist, ignore the error because following will re-initialize
          resolve();
        }
      });
    });

    // In loki DB implementation, these operations are all sync. Doesn't need an async lock
    // Create containers collection if not exists
    if (this.db.getCollection(this.CONTAINERS_COLLECTION) === null) {
      this.db.addCollection(this.CONTAINERS_COLLECTION, { unique: ["name"] });
    }

    // Create service properties collection if not exists
    let servicePropertiesColl = this.db.getCollection(
      this.SERVICE_PROPERTIES_COLLECTION
    );
    if (servicePropertiesColl === null) {
      servicePropertiesColl = this.db.addCollection(
        this.SERVICE_PROPERTIES_COLLECTION
      );
    }

    // Create default service properties document if not exists
    // Get SERVICE_PROPERTIES_DOCUMENT_LOKI_ID from DB if not exists
    const servicePropertiesDocs = servicePropertiesColl.where(() => true);
    if (servicePropertiesDocs.length === 0) {
      await this.setServiceProperties(this.defaultServiceProperties);
    } else if (servicePropertiesDocs.length === 1) {
      this.SERVICE_PROPERTIES_DOCUMENT_LOKI_ID = servicePropertiesDocs[0].$loki;
    } else {
      throw new Error(
        "LokiDB initialization error: Service properties collection has more than one document."
      );
    }

    await new Promise((resolve, reject) => {
      this.db.saveDatabase((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Update blob service properties. Create service properties document if not exists in DB.
   * Assume service properties collection has been created.
   *
   * @template T
   * @param {T} serviceProperties
   * @returns {Promise<T>}
   * @memberof LokiBlobDataStore
   */
  public async setServiceProperties<T extends Models.StorageServiceProperties>(
    serviceProperties: T
  ): Promise<T> {
    const coll = this.db.getCollection(this.SERVICE_PROPERTIES_COLLECTION);
    if (this.SERVICE_PROPERTIES_DOCUMENT_LOKI_ID !== undefined) {
      const existingDocument = coll.get(
        this.SERVICE_PROPERTIES_DOCUMENT_LOKI_ID
      );
      coll.remove(existingDocument);
    }

    const doc = coll.insert(serviceProperties);
    this.SERVICE_PROPERTIES_DOCUMENT_LOKI_ID = doc.$loki;
    return doc;
  }

  /**
   * Get service properties.
   * Assume service properties collection has already be initialized with 1 document.
   *
   * @template T
   * @returns {Promise<T>}
   * @memberof LokiBlobDataStore
   */
  public async getServiceProperties<
    T extends Models.StorageServiceProperties
  >(): Promise<T> {
    const coll = this.db.getCollection(this.SERVICE_PROPERTIES_COLLECTION);
    return coll.get(this.SERVICE_PROPERTIES_DOCUMENT_LOKI_ID!); // Only 1 document in service properties collection
  }

  /**
   * Create a new container to DB.
   * Assumes the container with same name doesn't exist.
   *
   * @template T
   * @param {T} container
   * @returns {Promise<T>}
   * @memberof LokiBlobDataStore
   */
  public async createContainer<T extends Models.ContainerItem>(
    container: T
  ): Promise<T> {
    this.db.addCollection(container.name);
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);
    return coll.insert(container);
  }

  /**
   * Get a container item from DB by container name.
   *
   * @template T
   * @param {string} container
   * @returns {Promise<T>}
   * @memberof LokiBlobDataStore
   */
  public async getContainer<T extends Models.ContainerItem>(
    container: string
  ): Promise<T | undefined> {
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);
    const doc = coll.by("name", container);
    return doc ? doc : undefined;
  }

  /**
   * Delete container item from DB.
   * Note that this method will remove container related collections and documents from DB.
   * Make sure blobs under the container has been properly removed before calling this method.
   *
   * @param {string} container
   * @returns {Promise<void>}
   * @memberof LokiBlobDataStore
   */
  public async deleteContainer(container: string): Promise<void> {
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);
    const doc = coll.by("name", container);
    coll.remove(doc);

    // Following line will remove all blobs documents under that container
    this.db.removeCollection(container);
  }

  /**
   * Update container item in DB.
   * Parameter container should be a valid loki DB document object retrieved by calling getContainer().
   *
   * @template T
   * @param {T} container A container loki document object got from getContainer()
   * @returns {Promise<T>}
   * @memberof LokiBlobDataStore
   */
  public async updateContainer<T extends Models.ContainerItem>(
    container: T
  ): Promise<T> {
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);
    return coll.update(container);
  }

  /**
   * List containers with query conditions specified.
   *
   * @template T
   * @param {string} [prefix=""]
   * @param {number} [maxResults=2000]
   * @param {number} [marker=0]
   * @returns {(Promise<[T[], number | undefined]>)} Return a tuple with [LIST_CONTAINERS, NEXT_MARKER]
   * @memberof LokiBlobDataStore
   */
  public async listContainers<T extends Models.ContainerItem>(
    prefix: string = "",
    maxResults: number = 2000,
    marker: number = 0
  ): Promise<[T[], number | undefined]> {
    const coll = this.db.getCollection(this.CONTAINERS_COLLECTION);

    const query =
      prefix === ""
        ? { $loki: { $gt: marker } }
        : { name: { $regex: `^${prefix}` }, $loki: { $gt: marker } };

    const docs = coll
      .chain()
      .find(query)
      .limit(maxResults)
      .data();

    if (docs.length < maxResults) {
      return [docs, undefined];
    } else {
      const nextMarker = docs[docs.length - 1].$loki;
      return [docs, nextMarker];
    }
  }

  public async createBlob<T extends Models.BlobItem>(
    blob: T,
    container: string
  ): Promise<T> {
    const coll = this.db.getCollection(container);
    const blobDoc = coll.findOne({ name: { $eq: blob.name } });
    if (blobDoc !== undefined && blobDoc !== null) {
      coll.remove(blobDoc);
    }

    return coll.insert(blob);
  }

  public async writeBlobData(
    container: string,
    blob: string,
    data: NodeJS.ReadableStream
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const path = join(this.persistencePath, container, blob);
      const ws = createWriteStream(path);
      data
        .pipe(ws)
        .on("close", resolve)
        .on("error", reject);
    });
  }

  /**
   * Close loki DB.
   *
   * @returns {Promise<void>}
   * @memberof LokiBlobDataStore
   */
  public async close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
