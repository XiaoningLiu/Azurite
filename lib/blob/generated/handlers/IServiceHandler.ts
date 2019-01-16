import * as Models from "../artifacts/models";
import Context from "../Context";

// Auto generated. Service handler interface to be manually implemented.
export default interface IServiceHandler {
  serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams,
    context: Context
  ): Promise<Models.IServiceListContainersSegmentResponse>;
}
