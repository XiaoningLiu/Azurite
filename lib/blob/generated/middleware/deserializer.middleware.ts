import Operation from "../artifacts/Operation";
import Specifications from "../artifacts/operation.specification";
import Context from "../Context";
import OperationMismatchError from "../errors/OperationMismatchError";
import IRequest from "../IRequest";
import { NextFunction } from "../MiddlewareFactory";
import ILogger from "../utils/ILogger";
import { deserialize } from "../utils/serializer";

/**
 * Deserializer Middleware. Deserialize incoming HTTP request into models.
 *
 * @export
 * @param {IRequest} req An IRequest object
 * @param {NextFunction} next An next callback or promise
 * @param {ILogger} logger A valid logger
 * @param {Context} context
 * @returns {void}
 */
export default function deserializerMiddleware(
  req: IRequest,
  next: NextFunction,
  logger: ILogger,
  context: Context
): void {
  logger.verbose(
    `DeserializerMiddleware: Start deserializing...`,
    context.contextID
  );

  if (context.operation === undefined) {
    const handlerError = new OperationMismatchError();
    logger.error(
      `DeserializerMiddleware: ${handlerError.message}`,
      context.contextID
    );
    return next(handlerError);
  }

  if (Specifications[context.operation] === undefined) {
    logger.warn(
      `DeserializerMiddleware: cannot find deserializer for operation ${
        Operation[context.operation]
      }`
    );
  }

  deserialize(req, Specifications[context.operation])
    .then((parameters) => {
      context.handlerParameters = parameters;
    })
    .then(next)
    .catch(next);
}
