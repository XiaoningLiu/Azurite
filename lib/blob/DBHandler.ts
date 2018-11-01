import IHandler from "./generated/IHandler";

import {
  IServiceListContainersSegmentRequest,
  IServiceListContainersSegmentResponse,
} from "./generated/IHandler";

export default class DBHandler implements IHandler {
  public async serviceListContainersSegment(
    request: IServiceListContainersSegmentRequest
  ): Promise<IServiceListContainersSegmentResponse> {
    return {
      RequestId: request.requestId ? "old-request-id" : "new-request-id",
      Version: "2018-22-22",
    };
  }
}
