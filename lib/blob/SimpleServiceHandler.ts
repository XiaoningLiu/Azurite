import * as Models from "./generated/models";
import IServiceHandler from "./generated/handlers/IServiceHandler";
import SimpleBaseHandler from "./SimpleBaseHandler";

/**
 * Manually implement handlers by implementing IServiceHandler interface.
 * Handlers will take to persistency layer directly.
 *
 * @export
 * @class SimpleHandler
 * @implements {IHandler}
 */
export default class SimpleHandler extends SimpleBaseHandler
  implements IServiceHandler {
  public async serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams
  ): Promise<Models.IServiceListContainersSegmentResponse> {
    const containerArray = [];
    for (const key in this.containers) {
      if (this.containers.hasOwnProperty(key)) {
        const container = this.containers[key];
        containerArray.push(container);
      }
    }

    const res: Models.IServiceListContainersSegmentResponse = {
      containerItems: containerArray,
      maxResults: options.maxresults || 2000,
      nextMarker: "",
      prefix: options.prefix || "",
      serviceEndpoint: "serviceEndpoint",
    };
    return res;
  }
}
