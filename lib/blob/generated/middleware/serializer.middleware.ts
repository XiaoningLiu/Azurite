import Operation from "../artifacts/Operation";
import Specifications from "../artifacts/operation.specification";
import Context from "../Context";
import OperationMismatchError from "../errors/OperationMismatchError";
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
    const handlerError = new OperationMismatchError();
    logger.error(
      `SerializerMiddleware: ${handlerError.message}`,
      context.contextID
    );
    return next(handlerError);
  }

  if (Specifications[context.operation] === undefined) {
    logger.warn(
      `SerializerMiddleware: cannot find serializer for operation ${
        Operation[context.operation]
      }`
    );
  }

  serialize(res, Specifications[context.operation], context.handlerResponses)
    .then(next)
    .catch(next);
}
