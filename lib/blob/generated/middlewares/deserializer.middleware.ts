import { NextFunction, Request, Response } from "express";

import Context from "../Context";
import HandlerError from "../HandlerError";
import ILogger from "../ILogger";
import Operation from "../Operation";
import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
} from "../operation.specification";
import { deserialize } from "../utils/serializer";

/**
 * Deserializer Middleware.
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
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

  logger.verbose(`Start deserializing...`, ctx.contextID);

  if (ctx.operation === undefined) {
    logger.error(
      [
        `Operation doesn't exist in context when deserializing.`,
        `Please make sure "dispatchMiddleware" is registered before "handlerMiddleware"`,
      ].join(),
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
    default:
      logger.warn(
        `deserializerMiddleware doesn't have deserializer for operation ${
          Operation[ctx.operation]
        }`
      );
      break;
  }
}
