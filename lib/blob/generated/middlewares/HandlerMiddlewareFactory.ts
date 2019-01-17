import { NextFunction, Request, RequestHandler, Response } from "express";

import Context from "../Context";
import UnhandledURLError from "../errors/UnhandledURLError";
import IContainerHandler from "../handlers/IContainerHandler";
import IServiceHandler from "../handlers/IServiceHandler";
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
   * @param {string} contextPath res.locals[contextPath] will be used to hold context
   * @memberof HandlerMiddlewareFactory
   */
  constructor(handlers: IHandlers, private readonly logger: ILogger, private readonly contextPath: string) {
    this.serviceHandler = handlers.serviceHandler;
    this.containerHandler = handlers.containerHandler;
  }

  public createHandlerMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const ctx = new Context(res.locals, this.contextPath);

      this.logger.verbose(
        `HandlerMiddleware: DeserializedParameters=${JSON.stringify(ctx.handlerParameters)}`,
        ctx.contextID
      );

      if (!ctx.operation) {
        const handlerError = new UnhandledURLError();
        this.logger.error(`HandlerMiddleware: ${handlerError.message}`, ctx.contextID);
        throw handlerError;
      }

      switch (ctx.operation) {
        case Operation.Service_ListContainersSegment:
          this.serviceListContainersSegmentMiddleware(req, res, next);
          break;
        case Operation.Container_Create:
          this.containerCreateMiddleware(req, res, next);
          break;
        default:
          this.logger.warn(`HandlerMiddleware: cannot find handler for operation ${Operation[ctx.operation]}`);
          break;
      }
    };
  }

  private serviceListContainersSegmentMiddleware(
    // tslint:disable-next-line:variable-name
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    const ctx = new Context(res.locals, this.contextPath);

    if (ctx.operation && ctx.operation === Operation.Service_ListContainersSegment) {
      this.serviceHandler
        .serviceListContainersSegment(ctx.handlerParameters!.options, ctx)
        .then((response) => {
          ctx.handlerResponses = response;
          next();
        })
        .catch(next);
    }
  }

  private containerCreateMiddleware(
    // tslint:disable-next-line:variable-name
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    const ctx = new Context(res.locals, this.contextPath);

    if (ctx.operation && ctx.operation === Operation.Container_Create) {
      this.containerHandler
        .containerCreate(ctx.handlerParameters!.options, ctx)
        .then((response) => {
          ctx.handlerResponses = response;
          next();
        })
        .catch(next);
    }
  }
}
