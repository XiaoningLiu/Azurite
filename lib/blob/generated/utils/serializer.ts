import { Request, Response } from "express";
import * as msRest from "ms-rest-js";

import { IHandlerParameters } from "../Context";
import * as Mappers from "../mappers";
import { stringifyXML } from "./xml";

export declare type ParameterPath =
  | string
  | string[]
  | {
      [propertyName: string]: ParameterPath;
    };

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

export async function serialize(
  res: Response,
  spec: msRest.OperationSpec,
  handlerResponse: any
): Promise<void> {
  // TODO: handle all kinds of reponses
  // tslint:disable-next-line:radix
  const responseStatusCode = Number.parseInt(Object.keys(spec.responses)[0]);
  res.status(responseStatusCode);

  const response = spec.responses[responseStatusCode];

  // Serialize headers
  const headerSerializer = new msRest.Serializer(Mappers);
  const rawHeaders = headerSerializer.serialize(
    response.headersMapper!,
    handlerResponse
  );

  for (const headerKey in rawHeaders) {
    if (rawHeaders.hasOwnProperty(headerKey)) {
      const headerValue = rawHeaders[headerKey];
      res.setHeader(headerKey, headerValue);
    }
  }

  // Serialize XML bodies
  if (response.bodyMapper) {
    const body = spec.serializer.serialize(
      response.bodyMapper!,
      handlerResponse
    );
    const xmlBody = stringifyXML(body, {
      rootName:
        response.bodyMapper!.xmlName || response.bodyMapper!.serializedName,
    });
    res.contentType(`application/xml`);

    // TODO: Should send response in a serializer?
    res.send(xmlBody);
  }
}
