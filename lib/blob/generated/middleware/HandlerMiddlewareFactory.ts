import Context from "../Context";
import UnhandledURLError from "../errors/UnhandledURLError";
import IContainerHandler from "../handlers/IContainerHandler";
import IServiceHandler from "../handlers/IServiceHandler";
import NextFunction from "../NextFunction";
import Operation from "../Operation";
import ILogger from "../utils/ILogger";

// Auto generated
export interface IHandlers {
  serviceHandler: IServiceHandler;
  containerHandler: IContainerHandler;
}

/**
 * Auto generated. HandlerMiddlewareFactory will accept handlers and create handler middleware.
 *
 * @export
 * @class HandlerMiddlewareFactory
 */
export default class HandlerMiddlewareFactory {
  private readonly serviceHandler: IServiceHandler;
  private readonly containerHandler: IContainerHandler;

  /**
   * Creates an instance of HandlerMiddlewareFactory.
   * Accept handlers and create handler middleware.
   *
   * @param {IHandlers} handlers Handlers implemented handler interfaces
   * @param {ILogger} logger A valid logger
   * @memberof HandlerMiddlewareFactory
   */
  constructor(handlers: IHandlers, private readonly logger: ILogger) {
    this.serviceHandler = handlers.serviceHandler;
    this.containerHandler = handlers.containerHandler;
  }

  /**
   * Creates a handler middleware from input handlers.
   *
   * @memberof HandlerMiddlewareFactory
   */
  public createHandlerMiddleware(): (
    next: NextFunction,
    context: Context
  ) => void {
    return (next: NextFunction, context: Context) => {
      this.logger.verbose(
        `HandlerMiddleware: DeserializedParameters=${JSON.stringify(
          context.handlerParameters
        )}`,
        context.contextID
      );

      if (!context.operation) {
        const handlerError = new UnhandledURLError();
        this.logger.error(
          `HandlerMiddleware: ${handlerError.message}`,
          context.contextID
        );
        throw handlerError;
      }

      switch (context.operation) {
        case Operation.Service_ListContainersSegment:
          this.serviceListContainersSegmentMiddleware(next, context);
          break;
        case Operation.Container_Create:
          this.containerCreateMiddleware(next, context);
          break;
        default:
          this.logger.warn(
            `HandlerMiddleware: cannot find handler for operation ${
              Operation[context.operation]
            }`
          );
          break;
      }
    };
  }

  private serviceListContainersSegmentMiddleware(
    next: NextFunction,
    context: Context
  ) {
    if (
      context.operation &&
      context.operation === Operation.Service_ListContainersSegment
    ) {
      this.serviceHandler
        .serviceListContainersSegment(
          context.handlerParameters!.options,
          context
        )
        .then((response) => {
          context.handlerResponses = response;
        })
        .then(next)
        .catch(next);
    }
  }

  private containerCreateMiddleware(next: NextFunction, context: Context) {
    if (context.operation && context.operation === Operation.Container_Create) {
      this.containerHandler
        .containerCreate(context.handlerParameters!.options, context)
        .then((response) => {
          context.handlerResponses = response;
        })
        .then(next)
        .catch(next);
    }
  }
}
