import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
} from "../artifacts/operation.specification";
import Context from "../Context";
import UnhandledURLError from "../errors/UnhandledURLError";
import IResponse from "../IResponse";
import NextFunction from "../NextFunction";
import Operation from "../Operation";
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
    const handlerError = new UnhandledURLError();
    logger.error(
      `SerializerMiddleware: ${handlerError.message}`,
      context.contextID
    );
    throw handlerError;
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
