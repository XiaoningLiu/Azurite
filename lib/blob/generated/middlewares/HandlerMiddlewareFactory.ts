import { NextFunction, Request, RequestHandler, Response } from "express";

import Context from "../Context";
import HandlerError from "../HandlerError";
import IContainerHandler from "../handlers/IContainerHandler";
import IServiceHandler from "../handlers/IServiceHandler";
import Operation from "../Operation";

// Auto generated
export interface IHandlers {
  serviceHandler: IServiceHandler;
  containerHandler: IContainerHandler;
}

export default class HandlerMiddlewareFactory {
  protected readonly serviceHandler: IServiceHandler;
  protected readonly containerHandler: IContainerHandler;

  constructor(handlers: IHandlers) {
    this.serviceHandler = handlers.serviceHandler;
    this.containerHandler = handlers.containerHandler;
  }

  public createHandlerMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const ctx = new Context(res.locals);

      if (!ctx.operation) {
        // tslint:disable:no-console
        console.error(
          `Cannot identify current operation. Please use "dispatchMiddleware" before "handlerMiddleware".`
        );
        return next(
          new HandlerError(500, "Internal Server Error", undefined, undefined)
        );
      }

      console.log(`[Handler Middleware]: parsed parameters are`);
      console.log(JSON.stringify(ctx.handlerParameters));
      if (ctx.operation === Operation.Service_ListContainersSegment) {
        this.serviceListContainersSegmentMiddleware(req, res, next);
      }

      switch (ctx.operation) {
        case Operation.Service_ListContainersSegment:
          this.serviceListContainersSegmentMiddleware(req, res, next);
          break;
        case Operation.Container_Create:
          this.containerCreateMiddleware(req, res, next);
        default:
          break;
      }
    };
  }

  public serviceListContainersSegmentMiddleware(
    // tslint:disable-next-line:variable-name
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    const ctx = new Context(res.locals);
    if (
      ctx.operation &&
      ctx.operation === Operation.Service_ListContainersSegment
    ) {
      this.serviceHandler
        .serviceListContainersSegment(ctx.handlerParameters!.options, ctx)
        .then((response) => {
          ctx.handlerResponses = response;
          next();
        })
        .catch(next);
    }
  }

  public containerCreateMiddleware(
    // tslint:disable-next-line:variable-name
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    const ctx = new Context(res.locals);
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
