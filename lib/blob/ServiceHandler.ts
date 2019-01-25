import BaseHandler from "./BaseHandler";
import * as Models from "./generated/artifacts/models";
import Context from "./generated/Context";
import IServiceHandler from "./generated/handlers/IServiceHandler";
import NotImplementedError from "./NotImplementedError";

/**
 * Manually implement handlers by implementing IServiceHandler interface.
 * Handlers will take to persistency layer directly.
 *
 * @export
 * @class SimpleHandler
 * @implements {IHandler}
 */
export default class ServiceHandler extends BaseHandler
  implements IServiceHandler {
  public async setProperties(
    storageServiceProperties: Models.StorageServiceProperties,
    options: Models.ServiceSetPropertiesOptionalParams,
    context: Context
  ): Promise<Models.ServiceSetPropertiesResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async getProperties(
    options: Models.ServiceGetPropertiesOptionalParams,
    context: Context
  ): Promise<Models.ServiceGetPropertiesResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async getStatistics(
    options: Models.ServiceGetStatisticsOptionalParams,
    context: Context
  ): Promise<Models.ServiceGetStatisticsResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async listContainersSegment(
    options: Models.ServiceListContainersSegmentOptionalParams,
    context: Context
  ): Promise<Models.ServiceListContainersSegmentResponse> {
    const containerArray = [];
    for (const key in this.containers) {
      if (this.containers.hasOwnProperty(key)) {
        const container = this.containers[key];
        containerArray.push(container);
      }
    }

    const res: Models.ServiceListContainersSegmentResponse = {
      containerItems: containerArray,
      maxResults: options.maxresults || 2000,
      nextMarker: "",
      prefix: options.prefix || "",
      serviceEndpoint: "serviceEndpoint",
      statusCode: 200,
    };

    return res;
  }

  public async getAccountInfo(
    context: Context
  ): Promise<Models.ServiceGetAccountInfoResponse> {
    throw new NotImplementedError(context.contextID);
  }

  public async serviceSetProperties(
    _storageServiceProperties: Models.StorageServiceProperties,
    _options: Models.ServiceSetPropertiesOptionalParams,
    context: Context
  ): Promise<Models.ServiceSetPropertiesResponse> {
    throw new NotImplementedError(context.contextID);
  }
}
