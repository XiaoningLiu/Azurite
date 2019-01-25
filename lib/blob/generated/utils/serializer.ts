import * as msRest from "@azure/ms-rest-js";

import * as Mappers from "../artifacts/mappers";
import { IHandlerParameters } from "../Context";
import IRequest from "../IRequest";
import IResponse from "../IResponse";
import { parseXML, stringifyXML } from "./xml";

export declare type ParameterPath =
  | string
  | string[]
  | {
      [propertyName: string]: ParameterPath;
    };

export async function deserialize(
  req: IRequest,
  spec: msRest.OperationSpec
): Promise<IHandlerParameters> {
  const parameters: IHandlerParameters = {};

  // Deserialize query parameters
  for (const queryParameter of spec.queryParameters || []) {
    if (!queryParameter.mapper.serializedName) {
      throw new TypeError(
        `QueryParameter mapper doesn't include valid "serializedName"`
      );
    }
    const queryKey = queryParameter.mapper.serializedName;
    const queryValueOriginal = req.getQuery(queryKey);
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

  // Deserialize header parameters
  for (const headerParameter of spec.headerParameters || []) {
    if (!headerParameter.mapper.serializedName) {
      throw new TypeError(
        `HeaderParameter mapper doesn't include valid "serializedName"`
      );
    }

    const headerKey = headerParameter.mapper.serializedName;
    const headerValueOriginal = req.getHeader(headerKey);
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

  // Deserialize body
  const bodyParameter = spec.requestBody;

  if (bodyParameter) {
    const jsonContentTypes = ["application/json", "text/json"];
    const xmlContentTypes = ["application/xml", "application/atom+xml"];
    const contentType = req.getHeader("content-type") || "";
    const contentComponents = !contentType
      ? []
      : contentType.split(";").map((component) => component.toLowerCase());

    const isRequestWithJSON = contentComponents.some(
      (component) => jsonContentTypes.indexOf(component) !== -1
    ); // TODO
    const isRequestWithXML =
      spec.isXML ||
      contentComponents.some(
        (component) => xmlContentTypes.indexOf(component) !== -1
      );
    // const isRequestWithStream = false;

    const body = await readRequestIntoText(req);
    let parsedBody: object = {};
    if (isRequestWithJSON) {
      // read body
      parsedBody = JSON.parse(body);
    } else if (isRequestWithXML) {
      parsedBody = await parseXML(body);
    }

    let valueToDeserialize: any = parsedBody;
    if (
      spec.isXML &&
      bodyParameter.mapper.type.name === msRest.MapperType.Sequence
    ) {
      valueToDeserialize =
        typeof valueToDeserialize === "object"
          ? valueToDeserialize[bodyParameter.mapper.xmlElementName!]
          : [];
    }

    parsedBody = spec.serializer.deserialize(
      bodyParameter.mapper,
      valueToDeserialize,
      bodyParameter.mapper.serializedName!
    );

    setParametersValue(parameters, bodyParameter.parameterPath, parsedBody);

    setParametersValue(parameters, "body", req);
  }

  return parameters;
}

async function readRequestIntoText(req: IRequest): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const segments: string[] = [];
    const bodyStream = req.getBodyStream();
    bodyStream.on("data", (buffer) => {
      segments.push(buffer);
    });
    bodyStream.on("error", reject);
    bodyStream.on("end", () => {
      const joined = segments.join("");
      resolve(joined);
    });
  });
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
  res: IResponse,
  spec: msRest.OperationSpec,
  handlerResponse: any
): Promise<void> {
  const statusCodeInResponse: number = handlerResponse.statusCode;
  res.setStatusCode(statusCodeInResponse);

  const responseSpec = spec.responses[statusCodeInResponse];
  if (!responseSpec) {
    throw new TypeError(
      `Request specification doesn't include provided response status code`
    );
  }

  // Serialize headers
  const headerSerializer = new msRest.Serializer(Mappers);
  const rawHeaders = headerSerializer.serialize(
    responseSpec.headersMapper!,
    handlerResponse
  );
  for (const headerKey in rawHeaders) {
    if (rawHeaders.hasOwnProperty(headerKey)) {
      const headerValue = rawHeaders[headerKey];
      res.setHeader(headerKey, headerValue);
    }
  }

  // Serialize XML bodies
  if (spec.isXML && responseSpec.bodyMapper) {
    const body = spec.serializer.serialize(
      responseSpec.bodyMapper!,
      handlerResponse
    );
    const xmlBody = stringifyXML(body, {
      rootName:
        responseSpec.bodyMapper!.xmlName ||
        responseSpec.bodyMapper!.serializedName,
    });
    res.setContentType(`application/xml`);

    // TODO: Should send response in a serializer?
    res.getBodyStream().write(xmlBody);
  }
}
