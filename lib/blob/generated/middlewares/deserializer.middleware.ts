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

  logger.verbose(
    `DeserializerMiddleware: Start deserializing...`,
    ctx.contextID
  );

  if (ctx.operation === undefined) {
    logger.error(
      [
        `DeserializerMiddleware: Operation doesn't exist in context when deserializing.`,
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

    logger.error(
      `DeserializerMiddleware: ${handlerError.message}`,
      ctx.contextID
    );

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
    default:
      logger.warn(
        `DeserializerMiddleware: doesn't have deserializer for operation ${
          Operation[ctx.operation]
        }`
      );
      break;
  }
}
