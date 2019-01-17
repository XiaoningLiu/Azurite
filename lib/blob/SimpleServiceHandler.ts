import * as Models from "./generated/artifacts/models";
import IServiceHandler from "./generated/handlers/IServiceHandler";
import NotImplementedError from "./NotImplementedError";
import SimpleBaseHandler from "./SimpleBaseHandler";

/**
 * Manually implement handlers by implementing IServiceHandler interface.
 * Handlers will take to persistency layer directly.
 *
 * @export
 * @class SimpleHandler
 * @implements {IHandler}
 */
export default class SimpleHandler extends SimpleBaseHandler implements IServiceHandler {
  public async serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams
  ): Promise<Models.IServiceListContainersSegmentResponse_200> {
    const containerArray = [];
    for (const key in this.containers) {
      if (this.containers.hasOwnProperty(key)) {
        const container = this.containers[key];
        containerArray.push(container);
      }
    }

    const res: Models.IServiceListContainersSegmentResponse_200 = {
      containerItems: containerArray,
      maxResults: options.maxresults || 2000,
      nextMarker: "",
      prefix: options.prefix || "",
      serviceEndpoint: "serviceEndpoint",
      statusCode: 200,
    };
    return res;
  }

  public async serviceSetProperties(
    _storageServiceProperties: Models.IStorageServiceProperties,
    _options: Models.IServiceSetPropertiesOptionalParams
  ): Promise<Models.ServiceSetPropertiesResponse_201> {
    throw new NotImplementedError();
  }
}
