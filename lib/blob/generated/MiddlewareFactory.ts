import { IHandlers } from "./middlewares/HandlerMiddlewareFactory";
import { Callback } from "./NextFunction";
import ILogger from "./utils/ILogger";

export type MiddlewareTypes = Callback;

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
export default abstract class MiddlewareFactory {
  /**
   * Creates an instance of MiddlewareFactory.
   *
   * @param {ILogger} logger A valid logger
   * @memberof MiddlewareFactory
   */
  public constructor(protected readonly logger: ILogger) {}

  /**
   * DispatchMiddleware is the 1s middleware should be used among other generated middleware.
   *
   * @returns {MiddlewareTypes}
   * @memberof MiddlewareFactory
   */
  public abstract createDispatchMiddleware(): MiddlewareTypes;

  /**
   * DeserializerMiddleware is the 2nd middleware should be used among other generated middleware.
   *
   * @returns {MiddlewareTypes}
   * @memberof MiddlewareFactory
   */
  public abstract createDeserializerMiddleware(): MiddlewareTypes;

  /**
   * HandlerMiddleware is the 3rd middleware should be used among other generated middleware.
   *
   * @param {IHandlers} handlers
   * @returns {MiddlewareTypes}
   * @memberof MiddlewareFactory
   */
  public abstract createHandlerMiddleware(handlers: IHandlers): MiddlewareTypes;

  /**
   * SerializerMiddleware is the 4st middleware should be used among other generated middleware.
   *
   * @returns {MiddlewareTypes}
   * @memberof MiddlewareFactory
   */
  public abstract createSerializerMiddleware(): MiddlewareTypes;

  /**
   * ErrorMiddleware is the 5st middleware should be used among other generated middleware.
   *
   * @returns {MiddlewareTypes}
   * @memberof MiddlewareFactory
   */
  public abstract createErrorMiddleware(): MiddlewareTypes;

  /**
   * EndMiddleware is the 6st middleware should be used among other generated middleware.
   *
   * @returns {MiddlewareTypes}
   * @memberof MiddlewareFactory
   */
  public abstract createEndMiddleware(): MiddlewareTypes;
}
