import IContext from "./generated/IContext";
import IHandler from "./generated/IHandler";
import * as Models from "./generated/models";

/**
 * Manually implment handlers by implmenting IHandler interface.
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
  ): Promise<Models.IListContainersSegmentResponse> {
    const res: Models.IListContainersSegmentResponse = {
      maxResults: 10,
      nextMarker: "waht?",
      prefix: options.prefix || "RandomePrefix",
      serviceEndpoint: "serviceEndPoint",
    };
    return res;
  }
}
