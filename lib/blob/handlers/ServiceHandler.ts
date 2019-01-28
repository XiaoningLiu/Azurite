import NotImplementedError from "../errors/NotImplementedError";
import * as Models from "../generated/artifacts/models";
import Context from "../generated/Context";
import IServiceHandler from "../generated/handlers/IServiceHandler";
import { API_VERSION } from "../utils/constants";
import BaseHandler from "./BaseHandler";

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
    await this.dataStore.setServiceProperties(storageServiceProperties);
    const response: Models.ServiceSetPropertiesResponse = {
      requestId: context.contextID,
      statusCode: 202,
      version: API_VERSION,
    };
    return response;
  }

  public async getProperties(
    options: Models.ServiceGetPropertiesOptionalParams,
    context: Context
  ): Promise<Models.ServiceGetPropertiesResponse> {
    const properties = await this.dataStore.getServiceProperties();
    const response: Models.ServiceGetPropertiesResponse = {
      ...properties,
      requestId: context.contextID,
      statusCode: 200,
      version: API_VERSION,
    };
    return response;
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
    const LIST_CONTAINERS_MAX_RESULTS_DEFAULT = 2000;

    options.maxresults =
      options.maxresults === undefined
        ? LIST_CONTAINERS_MAX_RESULTS_DEFAULT
        : options.maxresults;
    options.prefix = options.prefix || "";

    const containers = await this.dataStore.listContainers<
      Models.ContainerItem
    >(options.prefix, options.maxresults);

    const res: Models.ServiceListContainersSegmentResponse = {
      containerItems: containers,
      maxResults: options.maxresults,
      nextMarker: "",
      prefix: options.prefix,
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
}
