// import * as msRest from "ms-rest-js";

import Operation from "../artifacts/Operation";
import Context from "../Context";
import InvalidUrlError from "../errors/InvalidUrlError";
import IRequest from "../IRequest";
import { NextFunction } from "../MiddlewareFactory";
import ILogger from "../utils/ILogger";

/**
 * Dispatch Middleware will delete operation of current HTTP request
 * from operation enum. Operation will be assigned to context held in res.locals.
 * Make sure use dispatchMiddleware is before another other generated middleware.
 *
 * @export
 * @param {IRequest} req An IRequest object
 * @param {NextFunction} next An next callback or promise
 * @param {ILogger} logger A valid logger
 * @param {Context} context
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

  const method = req.getMethod();
  if (method === "GET" && req.getQuery("comp") === "list") {
    context.operation = Operation.Service_ListContainersSegment;
  } else if (method === "PUT" && req.getQuery("restype") === "container") {
    context.operation = Operation.Container_Create;
  } else if (
    method === "PUT" &&
    req.getQuery("comp") === "properties" &&
    req.getQuery("restype") === "service"
  ) {
    context.operation = Operation.Service_SetProperties;
  }

  if (context.operation === undefined) {
    const handlerError = new InvalidUrlError();
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

// function isRequestSuitSpec(req: IRequest, spec: msRest.OperationSpec): boolean {
//   // Test URL path

//   return false;
// }
