import * as msRest from "ms-rest-js";

import Operation from "../artifacts/Operation";
import Specifications from "../artifacts/operation.specification";
import Context from "../Context";
import UnsupportedRequestError from "../errors/UnsupportedRequestError";
import IRequest from "../IRequest";
import { NextFunction } from "../MiddlewareFactory";
import ILogger from "../utils/ILogger";
import { isURITemplateMatch } from "../utils/utils";

/**
 * Dispatch Middleware will try to find out which operation of current HTTP request belongs to,
 * by going through request specifications. Operation enum will be assigned to context object.
 * Make sure dispatchMiddleware is triggered before other generated middleware.
 *
 * @export
 * @param {IRequest} req An request object
 * @param {NextFunction} next A callback
 * @param {ILogger} logger A valid logger
 * @param {Context} context Context object
 * @returns {void}
 */
export default function dispatchMiddleware(
  req: IRequest,
  next: NextFunction,
  logger: ILogger,
  context: Context
): void {
  logger.verbose(
    `DispatchMiddleware: Dispatching request...`,
    context.contextID
  );

  for (const key in Operation) {
    if (Operation.hasOwnProperty(key)) {
      const operation = parseInt(key, 10);
      if (isRequestAgainstOperation(req, Specifications[operation])) {
        context.operation = operation;
        break;
      }
    }
  }

  if (context.operation === undefined) {
    const handlerError = new UnsupportedRequestError();
    logger.error(
      `DispatchMiddleware: ${handlerError.message}`,
      context.contextID
    );
    return next(handlerError);
  }

  logger.info(
    `DispatchMiddleware: Operation=${Operation[context.operation]}`,
    context.contextID
  );

  next();
}

function isRequestAgainstOperation(
  req: IRequest,
  spec: msRest.OperationSpec
): boolean {
  if (req === undefined || spec === undefined) {
    return false;
  }

  // Validate HTTP method
  if (req.getMethod() !== spec.httpMethod) {
    return false;
  }

  // Validate URL path
  const path = spec.path
    ? spec.path.startsWith("/")
      ? spec.path
      : `/${spec.path}`
    : "/";
  if (!isURITemplateMatch(req.getPath(), path)) {
    return false;
  }

  // Validate required queryParameters
  for (const queryParameter of spec.queryParameters || []) {
    if (queryParameter.mapper.required) {
      const queryValue = req.getQuery(
        queryParameter.mapper.serializedName || ""
      );
      if (queryValue === undefined) {
        return false;
      }

      if (
        queryParameter.mapper.type.name === "Enum" &&
        queryParameter.mapper.type.allowedValues.findIndex((val) => {
          return val === queryValue;
        }) < 0
      ) {
        return false;
      }
    }
  }

  // Validate required header parameters
  for (const headerParameter of spec.headerParameters || []) {
    if (headerParameter.mapper.required) {
      const headerValue = req.getHeader(
        headerParameter.mapper.serializedName || ""
      );
      if (headerValue === undefined) {
        return false;
      }

      if (
        headerParameter.mapper.type.name === "Enum" &&
        headerParameter.mapper.type.allowedValues.findIndex((val) => {
          return val === headerValue;
        }) < 0
      ) {
        return false;
      }
    }
  }

  return true;
}
