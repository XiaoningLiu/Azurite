import Operation from "../artifacts/Operation";
import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
  setPropertiesOperationSpec,
} from "../artifacts/operation.specification";
import Context from "../Context";
import InvalidUrlError from "../errors/InvalidUrlError";
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
    const handlerError = new InvalidUrlError();
    logger.error(
      `DeserializerMiddleware: ${handlerError.message}`,
      context.contextID
    );
    return next(handlerError);
  }

  switch (context.operation) {
    case Operation.Service_ListContainersSegment:
      deserialize(req, listContainersSegmentOperationSpec)
        .then((parameters) => {
          context.handlerParameters = parameters;
        })
        .then(next)
        .catch(next);
      break;
    case Operation.Container_Create:
      deserialize(req, containerCreateOperationSpec)
        .then((parameters) => {
          context.handlerParameters = parameters;
        })
        .then(next)
        .catch(next);
      break;
    case Operation.Service_SetProperties:
      deserialize(req, setPropertiesOperationSpec)
        .then((parameters) => {
          context.handlerParameters = parameters;
        })
        .then(next)
        .catch(next);
      break;
    default:
      logger.warn(
        `DeserializerMiddleware: cannot find deserializer for operation ${
          Operation[context.operation]
        }`
      );
      next();
      break;
  }
}
