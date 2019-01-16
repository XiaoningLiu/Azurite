import Context from "../Context";
import * as Models from "../models";

// Auto generated. Service handler interface to be manually implemented.
export default interface IServiceHandler {
  serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams,
    context: Context
  ): Promise<Models.IServiceListContainersSegmentResponse>;
}
