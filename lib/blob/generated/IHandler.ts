import IContext from "./IContext";

/**
 * This is the protocol layer interface
 */
interface IHandler {
  serviceListContainersSegment(
    request: IServiceListContainersSegmentRequest,
    context: IContext
  ): Promise<IServiceListContainersSegmentResponse>;
}

export interface IServiceListContainersSegmentRequest {
  prefix?: string;
  marker?: string;
  maxresults?: number;
  include?: string;
  timeout?: number;
  version: string;
  requestId?: string;
}

export interface IServiceListContainersSegmentResponse {
  RequestId: string;
  Version: string;
}

export default IHandler;
