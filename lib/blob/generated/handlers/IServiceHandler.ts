import Context from "../Context";
import * as Models from "../models";

export default interface IServiceHandler {
  serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams,
    context: Context
  ): Promise<Models.IServiceListContainersSegmentResponse>;
}
