import IContext from "./IContext";
import * as Models from "./models";

/**
 * This is the protocol layer interface.
 * Create a new handler by implementing this interface.
 *
 */
interface IHandler {
  serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams,
    context: IContext
  ): Promise<Models.IServiceListContainersSegmentResponse>;

  containerCreate(
    options: Models.IContainerCreateOptionalParams,
    context: IContext
  ): Promise<Models.IContainerCreateResponse>;
}

export default IHandler;
