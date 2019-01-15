import { NextFunction, Request, Response } from "express";

import Context from "../Context";
import HandlerError from "../HandlerError";
import ILogger from "../ILogger";
import Operation from "../Operation";

/**
 * Dispatch Middleware will delete operation of current HTTP request
 * from operation enum. Operation will be assigned to context held in res.locals.
 * Make sure use dispatchMiddleware is before another other generated middleware.
 *
 * @export
 * @param {Request} req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {NextFunction} next An express middleware next callback
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

  logger.verbose(`Dispatching request...`, ctx.contextID);
  if (req.method.toUpperCase() === "GET" && req.query.comp === "list") {
    ctx.operation = Operation.Service_ListContainersSegment;
  } else if (
    req.method.toUpperCase() === "PUT" &&
    req.query.restype === "container"
  ) {
    ctx.operation = Operation.Container_Create;
  }

  if (ctx.operation === undefined) {
    logger.error(
      [
        `Cannot identify operation in existing operation list.`,
        `Targeting URL may not follow any swagger request requirements.`,
      ].join(" "),
      ctx.contextID
    );

    const handlerError = new HandlerError(
      400,
      "Bad Request, URL is invalid",
      undefined,
      undefined
    );

    logger.error(`Set HTTP code: ${handlerError.statusCode}`, ctx.contextID);
    logger.error(`Set error message: ${handlerError.message}`, ctx.contextID);

    throw handlerError;
  }

  logger.info(`Operation=${Operation[ctx.operation]}`, ctx.contextID);
  next();
}
