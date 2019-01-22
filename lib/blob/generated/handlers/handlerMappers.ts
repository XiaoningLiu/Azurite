import Operation from "../artifacts/Operation";

export interface IHandlerPath {
  handler: string;
  method: string;
  arguments: string[];
}

const operationHandlerMapping: {
  [key: number]: IHandlerPath;
} = {};

operationHandlerMapping[Operation.Container_Create] = {
  arguments: ["options"],
  handler: "containerHandler",
  method: "containerCreate",
};

operationHandlerMapping[Operation.Service_ListContainersSegment] = {
  arguments: ["options"],
  handler: "serviceHandler",
  method: "serviceListContainersSegment",
};

operationHandlerMapping[Operation.Service_SetProperties] = {
  arguments: ["storageServiceProperties", "options"],
  handler: "serviceHandler",
  method: "serviceSetProperties",
};

export default function getHandlerByOperation(
  operation: Operation
): IHandlerPath | undefined {
  return operationHandlerMapping[operation];
}
