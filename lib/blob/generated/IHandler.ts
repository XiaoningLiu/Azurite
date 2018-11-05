import IContext from "./IContext";
import * as Models from "./models";

/**
 * This is the protocol layer interface.
 * Create a new handler by implenting this interface.
 *
 */
interface IHandler {
  serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams,
    context: IContext
  ): Promise<Models.IServiceListContainersSegmentResponse>;
}

export default IHandler;
