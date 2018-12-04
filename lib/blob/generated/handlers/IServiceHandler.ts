import IContext from "../IContext";
import * as Models from "../models";

export default interface IServiceHandler {
  serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams,
    context: IContext
  ): Promise<Models.IServiceListContainersSegmentResponse>;
}
