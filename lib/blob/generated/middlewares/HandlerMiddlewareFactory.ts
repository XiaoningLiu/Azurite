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
    return async (req: Request, res: Response, next: NextFunction) => {
      const ctx = getContextFromResponse(res);

      if (!ctx.operation) {
        // tslint:disable-next-line:no-console
        console.error(
          `Cannot identify current operation. Please use "dispatchMiddleware" before "handlerMiddleware".`
        );
        next(
          new ServerError(500, "Internal Server Error", undefined, undefined)
        );
        return;
      }

      if (ctx.operation === Operation.Service_ListContainersSegment) {
        await this.serviceListContainersSegmentMiddleware(req, res, next);
      }
    };
  }

  public async serviceListContainersSegmentMiddleware(
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
      ctx.handlerResponses = await this.handler.serviceListContainersSegment(
        ctx.handlerParameters[0],
        ctx
      );
      next();
    }
  }
}

export default HandlerMiddlewareFactory;
