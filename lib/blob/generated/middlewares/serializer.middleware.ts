import { NextFunction, Request, Response } from "express";

import Context from "../Context";
import ILogger from "../ILogger";
import Operation from "../Operation";
import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
} from "../operation.specification";
import { serialize } from "../utils/serializer";

/**
 * SerializerMiddleware will serialize models into HTTP responses.
 *
 * @export
 * @param {Request} _req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {NextFunction} next An express middleware next callback
 * @param {ILogger} logger A valid logger
 * @param {string} contextPath res.locals[contextPath] will be used to hold context
 */
export default function serializerMiddleware(
  // tslint:disable-next-line:variable-name
  _req: Request,
  res: Response,
  next: NextFunction,
  logger: ILogger,
  contextPath: string
): void {
  const ctx = new Context(res.locals, contextPath);

  logger.verbose(`SerializerMiddleware: Start serializing...`, ctx.contextID);

  switch (ctx.operation!) {
    case Operation.Service_ListContainersSegment:
      serialize(res, listContainersSegmentOperationSpec, ctx.handlerResponses)
        .then(() => {
          next();
        })
        .catch(next);
      break;
    case Operation.Container_Create:
      serialize(res, containerCreateOperationSpec, ctx.handlerResponses)
        .then(() => {
          next();
        })
        .catch(next);
    default:
      break;
  }
}
