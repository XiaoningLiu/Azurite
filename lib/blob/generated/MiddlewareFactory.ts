import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import ILogger from "./ILogger";
import deserializerMiddleware from "./middlewares/deserializer.middleware";
import dispatchMiddleware from "./middlewares/dispatch.middleware";
import endMiddleware from "./middlewares/end.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import HandlerMiddlewareFactory, {
  IHandlers,
} from "./middlewares/HandlerMiddlewareFactory";
import serializerMiddleware from "./middlewares/serializer.middleware";

/**
 * MiddlewareFactory will generate middleware according to swagger definitions.
 * Generated middleware MUST be used by strict order:
 *  * dispatchMiddleware
 *  * DeserializerMiddleware
 *  * HandlerMiddleware
 *  * SerializerMiddleware
 *  * ErrorMiddleware
 *  * EndMiddleware
 *
 * @export
 * @class MiddlewareFactory
 */
export default class MiddlewareFactory {
  /**
   * Creates an instance of MiddlewareFactory.
   *
   * @param {ILogger} logger A valid logger
   * @param {string} [contextPath="default_context"] Optional. res.locals[contextPath] will be used to hold context
   * @memberof MiddlewareFactory
   */
  public constructor(
    private readonly logger: ILogger,
    private readonly contextPath: string = "default_context"
  ) {}

  /**
   * DispatchMiddleware is the 1s middleware should be used among other generated middleware.
   *
   * @returns {RequestHandler}
   * @memberof MiddlewareFactory
   */
  public createDispatchMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      dispatchMiddleware(req, res, next, this.logger, this.contextPath);
    };
  }

  /**
   * DeserializerMiddleware is the 2nd middleware should be used among other generated middleware.
   *
   * @returns {RequestHandler}
   * @memberof MiddlewareFactory
   */
  public createDeserializerMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      deserializerMiddleware(req, res, next, this.logger, this.contextPath);
    };
  }

  /**
   * HandlerMiddleware is the 3rd middleware should be used among other generated middleware.
   *
   * @param {IHandlers} handlers
   * @returns {RequestHandler}
   * @memberof MiddlewareFactory
   */
  public createHandlerMiddleware(handlers: IHandlers): RequestHandler {
    const handlerMiddlewareFactory = new HandlerMiddlewareFactory(
      handlers,
      this.logger,
      this.contextPath
    );
    return handlerMiddlewareFactory.createHandlerMiddleware();
  }

  /**
   * SerializerMiddleware is the 4st middleware should be used among other generated middleware.
   *
   * @returns {RequestHandler}
   * @memberof MiddlewareFactory
   */
  public createSerializerMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      serializerMiddleware(req, res, next, this.logger, this.contextPath);
    };
  }

  /**
   * ErrorMiddleware is the 5st middleware should be used among other generated middleware.
   *
   * @returns {ErrorRequestHandler}
   * @memberof MiddlewareFactory
   */
  public createErrorMiddleware(): ErrorRequestHandler {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      errorMiddleware(err, req, res, next, this.logger, this.contextPath);
    };
  }

  /**
   * EndMiddleware is the 6st middleware should be used among other generated middleware.
   *
   * @returns {RequestHandler}
   * @memberof MiddlewareFactory
   */
  public createEndMiddleware(): RequestHandler {
    return (req: Request, res: Response) => {
      endMiddleware(req, res, this.logger, this.contextPath);
    };
  }
}
