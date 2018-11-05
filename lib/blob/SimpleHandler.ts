import IContext from "./generated/IContext";
import IHandler from "./generated/IHandler";
import * as Models from "./generated/models";

/**
 * Manually implement handlers by implementing IHandler interface.
 * Handlers will take to persistency layer directly.
 *
 * @export
 * @class SimpleHandler
 * @implements {IHandler}
 */
export default class SimpleHandler implements IHandler {
  public async serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams,
    _context: IContext
  ): Promise<Models.IServiceListContainersSegmentResponse> {
    const res: Models.IServiceListContainersSegmentResponse = {
      maxResults: 10,
      nextMarker: "waht?",
      prefix: options.prefix || "RandomePrefix",
      serviceEndpoint: "serviceEndPoint",
    };
    return res;
  }
}
