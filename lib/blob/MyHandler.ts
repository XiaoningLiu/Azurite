import IContext from "./generated/IContext";
import IHandler from "./generated/IHandler";
import * as Models from "./generated/models";

export default class MyHandler implements IHandler {
  public serviceListContainersSegment(
    _options: Models.IServiceListContainersSegmentOptionalParams,
    _context: IContext
  ): Promise<Models.IServiceListContainersSegmentResponse> {
    throw new Error("Method not implemented.");
  }
  public containerCreate(
    _options: Models.IContainerCreateOptionalParams,
    _context: IContext
  ): Promise<Models.IContainerCreateResponse> {
    throw new Error("Method not implemented.");
  }
}
