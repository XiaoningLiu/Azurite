import { Request } from "express";
import * as msRest from "ms-rest-js";
import * as Mappers from "../generated/mappers";

import { IHandlerParameters, ParameterPath } from "../generated/IContext";
import {
  commitBlockListOperationSpec,
  listContainersSegmentOperationSpec,
} from "../generated/operation.specification";
import { parseXML, stringifyXML } from "./xml";

export async function deserialize(
  req: Request,
  spec: msRest.OperationSpec
): Promise<IHandlerParameters> {
  const parameters: IHandlerParameters = {};

  // Retrieve parameters in the header
  for (const queryParameter of spec.queryParameters || []) {
    if (!queryParameter.mapper.serializedName) {
      throw new TypeError(
        `QueryParameter mapper doesn't include valid "serializedName"`
      );
    }
    const queryKey = queryParameter.mapper.serializedName;
    const queryValueOriginal = req.query[queryKey];
    const queryValue = spec.serializer.deserialize(
      queryParameter.mapper,
      queryValueOriginal,
      queryKey
    );

    // TODO: Currently validation is only in serialize method,
    // remove when adding validateConstraints to deserialize()
    // TODO: Make serialize return ServerError according to different validations?
    spec.serializer.serialize(queryParameter.mapper, queryValue);

    setParametersValue(parameters, queryParameter.parameterPath, queryValue);
  }

  // Retrieve parameters in headers
  for (const headerParameter of spec.headerParameters || []) {
    if (!headerParameter.mapper.serializedName) {
      throw new TypeError(
        `HeaderParameter mapper doesn't include valid "serializedName"`
      );
    }

    const headerKey = headerParameter.mapper.serializedName;
    const headerValueOriginal = req.get(headerKey);
    const headerValue = spec.serializer.deserialize(
      headerParameter.mapper,
      headerValueOriginal,
      headerKey
    );

    // TODO: Currently validation is only in serialize method,
    // remove when adding validateConstraints to deserialize()
    spec.serializer.serialize(headerParameter.mapper, headerValue);

    setParametersValue(parameters, headerParameter.parameterPath, headerValue);
  }

  return parameters;
}

function setParametersValue(
  parameters: IHandlerParameters,
  parameterPath: ParameterPath,
  parameterValue: any
) {
  if (typeof parameterPath === "string") {
    parameters[parameterPath] = parameterValue;
  } else if (Array.isArray(parameterPath)) {
    let leafParent = parameters;
    for (let i = 0; i < parameterPath.length - 1; i++) {
      const currentPropertyName = parameterPath[i];
      if (!leafParent[currentPropertyName]) {
        leafParent[currentPropertyName] = {};
      }
      leafParent = leafParent[currentPropertyName];
    }

    const lastPropertyName = parameterPath[parameterPath.length - 1];
    leafParent[lastPropertyName] = parameterValue;
  } else {
    throw new TypeError(`parameterPath is not string or string[]`);
  }
}

// Serialize query parameter
let result = listContainersSegmentOperationSpec.serializer.serialize(
  listContainersSegmentOperationSpec.queryParameters![0].mapper,
  "con"
);

console.log(result);

// Serialize response headers
const unXMLSerializer = new msRest.Serializer(Mappers);
result = unXMLSerializer.serialize(
  listContainersSegmentOperationSpec.responses[200].headersMapper!,
  { requestId: "customizedRequestID", version: "customized-version" }
);
console.log(result);

// Serialize response XML body
result = listContainersSegmentOperationSpec.serializer.serialize(
  listContainersSegmentOperationSpec.responses[200].bodyMapper!,
  {
    requestId: "customizedRequestID",
    version: "customized-version",
    serviceEndpoint: "endpoint",
    prefix: "prefix",
    maxResults: 200,
    nextMarker: "nextMarker",
    containerItems: [],
  }
);
console.log(result);

// Serialize XML body
result = commitBlockListOperationSpec.serializer.serialize(
  commitBlockListOperationSpec.requestBody!.mapper,
  {
    committed: ["com1", "com2"],
    latest: ["la1", "la2"],
    uncommitted: ["un1", "un2", "un3"],
  },
  "path"
);

const xmlResult = stringifyXML(result, {
  rootName:
    commitBlockListOperationSpec.requestBody!.mapper.xmlName ||
    commitBlockListOperationSpec.requestBody!.mapper.serializedName,
});

console.log(xmlResult);

// Deserialize XML body

parseXML(xmlResult).then((valueToDeserialize) => {
  result = commitBlockListOperationSpec.serializer.deserialize(
    commitBlockListOperationSpec.requestBody!.mapper,
    valueToDeserialize,
    "xxx.bodyxx"
  );

  console.log(result);
});
