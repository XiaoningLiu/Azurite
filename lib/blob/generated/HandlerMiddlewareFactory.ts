import { NextFunction, Request, RequestHandler, Response } from "express";

import IContext from "./IContext";
import IHandler, {
  IServiceListContainersSegmentRequest,
  IServiceListContainersSegmentResponse,
} from "./IHandler";
import Operation from "./operation";
import ServerError from "./ServerError";

class HandlerMiddlewareFactory {
  protected readonly handler: IHandler;
  protected readonly serilizer: any;

  constructor(handler: IHandler) {
    this.handler = handler;

    this.serilizer = {
      deserilize: (_req: Request): any => {
        return {
          prefix: "prefix",
          timeout: 20,
          version: "2018-03-28",
        };
      },

      serilize: (
        res: Response,
        result: IServiceListContainersSegmentResponse
      ) => {
        res.set("x-ms-version", result.Version);
        res.set("x-ms-request-id", result.RequestId);
      },
    };
  }

  public newHandlerMiddleware(): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      const ctx = res.locals.context as IContext;

      if (!ctx.operation) {
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
        return;
      }
    };
  }

  public async serviceListContainersSegmentMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const ctx = res.locals.context as IContext;
    if (
      ctx.operation &&
      ctx.operation === Operation.Service_ListContainersSegment
    ) {
      const param = this.serilizer.deserilize(
        req
      ) as IServiceListContainersSegmentRequest;
      const result = await this.handler.serviceListContainersSegment(param);
      this.serilizer.serilize(res, result);
      next();
    }
  }
}

export default HandlerMiddlewareFactory;
