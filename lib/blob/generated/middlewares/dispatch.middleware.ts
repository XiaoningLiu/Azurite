import Context from "../Context";
import UnhandledURLError from "../errors/UnhandledURLError";
import IRequest from "../IRequest";
import NextFunction from "../NextFunction";
import Operation from "../Operation";
import ILogger from "../utils/ILogger";

/**
 * Dispatch Middleware will delete operation of current HTTP request
 * from operation enum. Operation will be assigned to context held in res.locals.
 * Make sure use dispatchMiddleware is before another other generated middleware.
 *
 * @export
 * @param {Request} req An IRequest object
 * @param {Response} res An IResponse object
 * @param {NextFunction} next An next callback or promise
 * @param {ILogger} logger A valid logger
 * @param {Context} context
 * @returns {void}
 */
export default function dispatchMiddleware(
  req: IRequest,
  next: NextFunction,
  logger: ILogger,
  context: Context
): void {
  logger.verbose(
    `DispatchMiddleware: Dispatching request...`,
    context.contextID
  );

  if (req.method === "GET" && req.query("comp") === "list") {
    context.operation = Operation.Service_ListContainersSegment;
  } else if (req.method === "PUT" && req.query("restype") === "container") {
    context.operation = Operation.Container_Create;
  } else if (
    req.method === "PUT" &&
    req.query("comp") === "properties" &&
    req.query("restype") === "service"
  ) {
    context.operation = Operation.Service_SetProperties;
  }

  if (context.operation === undefined) {
    const handlerError = new UnhandledURLError();
    logger.error(
      `DispatchMiddleware: ${handlerError.message}`,
      context.contextID
    );
    throw handlerError;
  }

  logger.info(
    `DispatchMiddleware: Operation=${Operation[context.operation]}`,
    context.contextID
  );

  next instanceof Promise ? next.then() : next();
}
