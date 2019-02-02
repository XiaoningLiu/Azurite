import BlobStorageContext from "../context/BlobStorageContext";
import NotImplementedError from "../errors/NotImplementedError";
import StorageError from "../errors/StorageError";
import * as Models from "../generated/artifacts/models";
import Context from "../generated/Context";
import IContainerHandler from "../generated/handlers/IContainerHandler";
import { API_VERSION } from "../utils/constants";
import { newEtag } from "../utils/utils";
import BaseHandler from "./BaseHandler";

/**
 * Manually implement handlers by implementing IContainerHandler interface.
 * Handlers will take to persistency layer directly.
 *
 * @export
 * @class SimpleContainerHandler
 * @implements {IHandler}
 */
export default class ContainerHandler extends BaseHandler
  implements IContainerHandler {
  public async create(
    options: Models.ContainerCreateOptionalParams,
    context: Context
  ): Promise<Models.ContainerCreateResponse> {
    const blobCtx = new BlobStorageContext(context);

    const etag = `"${new Date().getTime()}"`;
    const lastModified = new Date();

    try {
      await this.dataStore.createContainer({
        metadata: options.metadata,
        name: blobCtx.container!,
        properties: {
          etag,
          lastModified,
        },
      });
    } catch (err) {
      // TODO: Create a StorageErrorFactory class to represent common Azure Storage Errors
      throw new StorageError(
        409,
        "ContainerAlreadyExists",
        "The specified container already exists.",
        blobCtx.contextID!
      );
    }

    const response: Models.ContainerCreateResponse = {
      eTag: etag,
      lastModified,
      requestId: blobCtx.contextID,
      statusCode: 201,
      version: API_VERSION,
    };

    return response;
  }

  public async getProperties(
    options: Models.ContainerGetPropertiesOptionalParams,
    context: Context
  ): Promise<Models.ContainerGetPropertiesResponse> {
    const blobCtx = new BlobStorageContext(context);

    const container = await this.dataStore.getContainer<Models.ContainerItem>(
      blobCtx.container!
    );

    const response: Models.ContainerGetPropertiesResponse = {
      eTag: container.properties.etag,
      ...container.properties,
      requestId: blobCtx.contextID,
      statusCode: 200,
    };

    return response;
  }

  public async getPropertiesWithHead(
    options: Models.ContainerGetPropertiesOptionalParams,
    context: Context
  ): Promise<Models.ContainerGetPropertiesResponse> {
    return this.getProperties(options, context);
  }

  public async delete(
    options: Models.ContainerDeleteMethodOptionalParams,
    context: Context
  ): Promise<Models.ContainerDeleteResponse> {
    const blobCtx = new BlobStorageContext(context);

    await this.dataStore.deleteContainer(blobCtx.container!);

    const response: Models.ContainerDeleteResponse = {
      date: new Date(),
      requestId: blobCtx.contextID,
      statusCode: 202,
      version: API_VERSION,
    };

    return response;
  }

  public async setMetadata(
    options: Models.ContainerSetMetadataOptionalParams,
    context: Context
  ): Promise<Models.ContainerSetMetadataResponse> {
    const blobCtx = new BlobStorageContext(context);

    const container = await this.dataStore.getContainer<Models.ContainerItem>(
      blobCtx.container!
    );
    container.metadata = options.metadata;
    container.properties.lastModified = new Date();

    await this.dataStore.updateContainer(container);

    const response: Models.ContainerSetMetadataResponse = {
      date: container.properties.lastModified,
      eTag: newEtag(),
      lastModified: container.properties.lastModified,
      requestId: blobCtx.contextID,
      statusCode: 200,
    };

    return response;
  }

  public async getAccessPolicy(
    options: Models.ContainerGetAccessPolicyOptionalParams,
    context: Context
  ): Promise<Models.ContainerGetAccessPolicyResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async setAccessPolicy(
    options: Models.ContainerSetAccessPolicyOptionalParams,
    context: Context
  ): Promise<Models.ContainerSetAccessPolicyResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async acquireLease(
    options: Models.ContainerAcquireLeaseOptionalParams,
    context: Context
  ): Promise<Models.ContainerAcquireLeaseResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async releaseLease(
    leaseId: string,
    options: Models.ContainerReleaseLeaseOptionalParams,
    context: Context
  ): Promise<Models.ContainerReleaseLeaseResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async renewLease(
    leaseId: string,
    options: Models.ContainerRenewLeaseOptionalParams,
    context: Context
  ): Promise<Models.ContainerRenewLeaseResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async breakLease(
    options: Models.ContainerBreakLeaseOptionalParams,
    context: Context
  ): Promise<Models.ContainerBreakLeaseResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async changeLease(
    leaseId: string,
    proposedLeaseId: string,
    options: Models.ContainerChangeLeaseOptionalParams,
    context: Context
  ): Promise<Models.ContainerChangeLeaseResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async listBlobFlatSegment(
    options: Models.ContainerListBlobFlatSegmentOptionalParams,
    context: Context
  ): Promise<Models.ContainerListBlobFlatSegmentResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async listBlobHierarchySegment(
    delimiter: string,
    options: Models.ContainerListBlobHierarchySegmentOptionalParams,
    context: Context
  ): Promise<Models.ContainerListBlobHierarchySegmentResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async getAccountInfo(
    context: Context
  ): Promise<Models.ContainerGetAccountInfoResponse> {
    throw new NotImplementedError(context.contextID);
  }
}
