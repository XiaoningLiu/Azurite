import * as Models from "../artifacts/models";
import Context from "../Context";

// TODO: Some operations may have different response status code, for this kind of scenario
// the generator could generate several kinds of XXResponse models. According to the difference of models returned,
// serializer could handle different scenarios.

// Auto generated. Container handler interface to be manually implemented.
export default interface IContainerHandler {
  containerCreate(
    options: Models.IContainerCreateOptionalParams,
    context: Context
  ): Promise<Models.IContainerCreateResponse_201>;
}
