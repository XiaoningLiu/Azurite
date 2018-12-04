import { NextFunction, Request, Response } from "express";

import { getContextFromResponse, initializeContext } from "../IContext";
import Operation from "../operation";
import HandlerError from "../HandlerError";

/**
 * Dispath Middleware will dectet operation of current HTTP request
 * from operation list. Operation will be assigned to res.locals.context.
 * Make sure use dispathMiddleware before another other generated middlewares.
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export default function dispatchMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Initialize conetxt for the first time
  initializeContext(res, {});
  const ctx = getContextFromResponse(res);

  if (req.method.toUpperCase() === "GET" && req.query.comp === "list") {
    ctx.operation = Operation.Service_ListContainersSegment;
  } else if (
    req.method.toUpperCase() === "PUT" &&
    req.query.restype === "container"
  ) {
    ctx.operation = Operation.Container_Create;
  }

  // Every operation has one if condition checking
  // TODO: Performance improvement to skip iterator all operations list?
  if (!ctx.operation) {
    // tslint:disable-next-line:no-console
    console.warn(
      [
        `Cannot identify operation in existing operation list.`,
        `Please make sure "dispatchMiddleware" before "handlerMiddleware".`,
        `Or targeting URL doesn't follow Azure Storage Blob service requirements.`,
      ].join(" ")
    );
    return next(
      new HandlerError(400, "Bad Request, URL is invalid", undefined, undefined)
    );
  }

  next();
}
