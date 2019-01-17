import { NextFunction, Request, Response } from "express";

import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
  setPropertiesOperationSpec,
} from "../artifacts/operation.specification";
import Context from "../Context";
import UnhandledURLError from "../errors/UnhandledURLError";
import Operation from "../Operation";
import ILogger from "../utils/ILogger";
import { deserialize } from "../utils/serializer";

/**
 * Deserializer Middleware. Deserialize incoming HTTP request into models.
 *
 * @export
 * @param {Request} req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {NextFunction} next An express middleware next callback
 * @returns {void}
 */
export default function deserializerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
  logger: ILogger,
  contextPath: string
): void {
  const ctx = new Context(res.locals, contextPath);
  logger.verbose(`DeserializerMiddleware: Start deserializing...`, ctx.contextID);

  if (ctx.operation === undefined) {
    const handlerError = new UnhandledURLError();
    logger.error(`DeserializerMiddleware: ${handlerError.message}`, ctx.contextID);
    throw handlerError;
  }

  switch (ctx.operation) {
    case Operation.Service_ListContainersSegment:
      deserialize(req, listContainersSegmentOperationSpec)
        .then((parameters) => {
          ctx.handlerParameters = parameters;
          next();
        })
        .catch(next);
      break;
    case Operation.Container_Create:
      deserialize(req, containerCreateOperationSpec)
        .then((parameters) => {
          ctx.handlerParameters = parameters;
          next();
        })
        .catch(next);
      break;
    case Operation.Service_SetProperties:
      deserialize(req, setPropertiesOperationSpec)
        .then((parameters) => {
          ctx.handlerParameters = parameters;
          next();
        })
        .catch(next);
      break;
    default:
      logger.warn(`DeserializerMiddleware: cannot find deserializer for operation ${Operation[ctx.operation]}`);
      break;
  }
}
