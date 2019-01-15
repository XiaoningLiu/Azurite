import { Express, NextFunction, Request, Response } from "express";

import ILogger from "../ILogger";
import deserializerMiddleware from "./deserializer.middleware";
import dispatchMiddleware from "./dispatch.middleware";

export declare type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

/**
 * MiddlewareFactory will generate necessary factories according to swagger definitions.
 * TODO: Any better name?
 *
 * @export
 * @class MiddlewareFactory
 */
export default class MiddlewareFactory {
  public constructor(
    private readonly logger: ILogger,
    private readonly contextPath: string = "default_context"
  ) {}

  public register(express: Express) {
    express.use(this.createDispatchMiddleware);
    express.use(this.createDeserializerMiddleware);
  }

  public createDispatchMiddleware(): Middleware {
    return (req: Request, res: Response, next: NextFunction) => {
      dispatchMiddleware(req, res, next, this.logger, this.contextPath);
    };
  }

  public createDeserializerMiddleware(): Middleware {
    return (req: Request, res: Response, next: NextFunction) => {
      deserializerMiddleware(req, res, next, this.logger, this.contextPath);
    };
  }
}
