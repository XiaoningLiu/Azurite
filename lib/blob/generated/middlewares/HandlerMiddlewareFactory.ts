import { NextFunction, Request, RequestHandler, Response } from "express";

import { getContextFromResponse } from "../IContext";
import IHandler from "../IHandler";
import Operation from "../operation";
import ServerError from "../ServerError";

class HandlerMiddlewareFactory {
  protected readonly handler: IHandler;

  constructor(handler: IHandler) {
    this.handler = handler;
  }

  public newHandlerMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const ctx = getContextFromResponse(res);

      if (!ctx.operation) {
        console.error(
          `Cannot identify current operation. Please use "dispatchMiddleware" before "handlerMiddleware".`
        );
        return next(
          new ServerError(500, "Internal Server Error", undefined, undefined)
        );
      }

      console.log(`[Handler Middleware]: parsed parameters are`);
      console.log(JSON.stringify(ctx.handlerParameters));
      if (ctx.operation === Operation.Service_ListContainersSegment) {
        this.serviceListContainersSegmentMiddleware(req, res, next);
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
      ctx.handlerResponses = this.handler
        .serviceListContainersSegment(ctx.handlerParameters!.options, ctx)
        .then(() => next())
        .catch(next);
    }
  }
}

export default HandlerMiddlewareFactory;
