import IContext from "../IContext";
import * as Models from "../models";

// TODO: Some operations may have different response status code, for this kind of scenario
// the generator could generate several kinds of XXResponse models. According to the difference of models returned,
// serilizer could return different scenarios by calling instance of XXXResponse (better way?)
export default interface IContainerHandler {
  containerCreate(
    options: Models.IContainerCreateOptionalParams,
    context: IContext
  ): Promise<Models.IContainerCreateResponse>;
}
