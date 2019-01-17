import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import MiddlewareFactory from "./MiddlewareFactory";
import deserializerMiddleware from "./middlewares/deserializer.middleware";
import dispatchMiddleware from "./middlewares/dispatch.middleware";
import endMiddleware from "./middlewares/end.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import HandlerMiddlewareFactory, {
  IHandlers,
} from "./middlewares/HandlerMiddlewareFactory";
import serializerMiddleware from "./middlewares/serializer.middleware";
import ILogger from "./utils/ILogger";
import ExpressRequestAdapter from "./ExpressRequestAdapter";
import Context from "./Context";

/**
 * ExpressMiddlewareFactory will generate Express compatible middleware according to swagger definitions.
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
export default class ExpressMiddlewareFactory extends MiddlewareFactory {
  /**
   * Creates an instance of MiddlewareFactory.
   *
   * @param {ILogger} logger A valid logger
   * @param {string} [contextPath="default_context"] Optional. res.locals[contextPath] will be used to hold context
   * @memberof MiddlewareFactory
   */
  public constructor(
    logger: ILogger,
    private readonly contextPath: string = "default_context"
  ) {
    super(logger);
  }

  /**
   * DispatchMiddleware is the 1s middleware should be used among other generated middleware.
   *
   * @returns {RequestHandler}
   * @memberof MiddlewareFactory
   */
  public createDispatchMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      dispatchMiddleware(
        new ExpressRequestAdapter(req),
        next,
        this.logger,
        new Context(res.locals, this.contextPath)
      );
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
