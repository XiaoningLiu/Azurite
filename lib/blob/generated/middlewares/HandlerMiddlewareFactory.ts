import { NextFunction, Request, RequestHandler, Response } from "express";

import { getContextFromResponse } from "../IContext";
import Operation from "../operation";
import HandlerError from "../HandlerError";
import IServiceHandler from "../handlers/IServiceHandler";
import IContainerHandler from "../handlers/IContainerHandler";

class HandlerMiddlewareFactory {
  protected readonly serviceHandler: IServiceHandler;
  protected readonly containerHandler: IContainerHandler;

  constructor(
    serviceHandler: IServiceHandler,
    containerHandler: IContainerHandler
  ) {
    this.serviceHandler = serviceHandler;
    this.containerHandler = containerHandler;
  }

  public newHandlerMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const ctx = getContextFromResponse(res);

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
    const ctx = getContextFromResponse(res);
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
    const ctx = getContextFromResponse(res);
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

export default HandlerMiddlewareFactory;
