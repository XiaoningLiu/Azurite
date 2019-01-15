import Context from "../Context";
import * as Models from "../models";

// TODO: Some operations may have different response status code, for this kind of scenario
// the generator could generate several kinds of XXResponse models. According to the difference of models returned,
// serializer could return different scenarios by calling instance of XXXResponse (better way?)
export default interface IContainerHandler {
  containerCreate(
    options: Models.IContainerCreateOptionalParams,
    context: Context
  ): Promise<Models.IContainerCreateResponse>;
}
