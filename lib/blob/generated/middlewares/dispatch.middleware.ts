import { NextFunction, Request, Response } from "express";

import Context from "../Context";
import UnhandledURLError from "../errors/UnhandledURLError";
import Operation from "../Operation";
import ILogger from "../utils/ILogger";

/**
 * Dispatch Middleware will delete operation of current HTTP request
 * from operation enum. Operation will be assigned to context held in res.locals.
 * Make sure use dispatchMiddleware is before another other generated middleware.
 *
 * @export
 * @param {Request} req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {NextFunction} next An express middleware next callback
 * @param {ILogger} logger A valid logger
 * @param {string} contextPath res.locals[contextPath] will be used to hold context
 * @returns {void}
 */
export default function dispatchMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
  logger: ILogger,
  contextPath: string
): void {
  const ctx = new Context(res.locals, contextPath);
  logger.verbose(`DispatchMiddleware: Dispatching request...`, ctx.contextID);

  if (req.method.toUpperCase() === "GET" && req.query.comp === "list") {
    ctx.operation = Operation.Service_ListContainersSegment;
  } else if (req.method.toUpperCase() === "PUT" && req.query.restype === "container") {
    ctx.operation = Operation.Container_Create;
  } else if (req.method.toUpperCase() === "PUT" && req.query.comp === "properties" && req.query.restype === "service") {
    ctx.operation = Operation.Service_SetProperties;
  }

  if (ctx.operation === undefined) {
    const handlerError = new UnhandledURLError();
    logger.error(`DispatchMiddleware: ${handlerError.message}`, ctx.contextID);
    throw handlerError;
  }

  logger.info(`DispatchMiddleware: Operation=${Operation[ctx.operation]}`, ctx.contextID);
  next();
}
