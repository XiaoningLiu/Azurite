import Operation from "../artifacts/Operation";
import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
} from "../artifacts/operation.specification";
import Context from "../Context";
import InvalidUrlError from "../errors/InvalidUrlError";
import IResponse from "../IResponse";
import { NextFunction } from "../MiddlewareFactory";
import ILogger from "../utils/ILogger";
import { serialize } from "../utils/serializer";

/**
 * SerializerMiddleware will serialize models into HTTP responses.
 *
 * @export
 * @param {Response} res
 * @param {NextFunction} next
 * @param {ILogger} logger
 * @param {Context} context
 */
export default function serializerMiddleware(
  res: IResponse,
  next: NextFunction,
  logger: ILogger,
  context: Context
): void {
  logger.verbose(
    `SerializerMiddleware: Start serializing...`,
    context.contextID
  );

  if (context.operation === undefined) {
    const handlerError = new InvalidUrlError();
    logger.error(
      `SerializerMiddleware: ${handlerError.message}`,
      context.contextID
    );
    return next(handlerError);
  }

  switch (context.operation!) {
    case Operation.Service_ListContainersSegment:
      serialize(
        res,
        listContainersSegmentOperationSpec,
        context.handlerResponses
      )
        .then(next)
        .catch(next);
      break;
    case Operation.Container_Create:
      serialize(res, containerCreateOperationSpec, context.handlerResponses)
        .then(next)
        .catch(next);
    default:
      break;
  }
}
