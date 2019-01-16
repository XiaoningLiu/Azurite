import { NextFunction, Request, Response } from "express";

import Context from "../Context";
import HandlerError from "../HandlerError";
import ILogger from "../ILogger";

/**
 * errorMiddleware handles following 2 kinds of errors thrown from previous middlewares:
 *
 * 1. HandlerError will be serilized and return immediatelly.
 *    Most of expected errors, such as 5XX or 4XX errors are HandlerError.
 * 2. Other unexcepted errors will be serilized to 500 Internal Server error directly.
 *    Every this kind of error should be carefully checked, and consider to make it a HandlerError.
 *
 */
export default function errorMiddleware(
  err: HandlerError | Error,
  // tslint:disable-next-line:variable-name
  _req: Request,
  res: Response,
  next: NextFunction,
  logger: ILogger,
  contextPath: string
): void {
  const ctx = new Context(res.locals, contextPath);

  if (res.headersSent) {
    logger.warn(
      `Error middleware received an error, but response.headersSent is true, pass error to next middleware`,
      ctx.contextID
    );
    return next(err);
  }

  // Only handle ServerError, for other customized error types hand over to
  // other error handlers.
  if (err instanceof HandlerError) {
    logger.error(
      `ErrorMiddleware: received a HandlerError, fill error information to HTTP response`,
      ctx.contextID
    );

    logger.error(
      `ErrorMiddleware: ErrorName=${err.name} ErrorMessage=${
        err.message
      }  ErrorHTTPStatusCode=${err.statusCode} ErrorHTTPStatusMessage=${
        err.statusMessage
      } ErrorHTTPHeaders=${JSON.stringify(err.headers)} ErrorHTTPBody=${
        err.body
      } ErrorStack=${JSON.stringify(err.stack)}`,
      ctx.contextID
    );

    logger.error(
      `ErrorMiddleware: Set HTTP code: ${err.statusCode}`,
      ctx.contextID
    );

    res.status(err.statusCode);
    if (err.statusMessage) {
      logger.error(
        `ErrorMiddleware: Set HTTP status message: ${err.statusMessage}`,
        ctx.contextID
      );
      res.statusMessage = err.statusMessage;
    }

    if (err.headers) {
      for (const key in err.headers) {
        if (err.headers.hasOwnProperty(key)) {
          const value = err.headers[key];
          if (value) {
            logger.error(
              `ErrorMiddleware: Set HTTP Header: ${key}=${value}`,
              ctx.contextID
            );
            res.setHeader(key, value);
          }
        }
      }
    }

    const totalTimeInMS = new Date().getTime() - ctx.startTime.getTime();
    logger.error(
      `ErrorMiddleware: End response. TotalTimeInMS=${totalTimeInMS} Headers=${JSON.stringify(
        res.getHeaders()
      )}`,
      ctx.contextID
    );

    res.send(err.body);
    return;
  } else if (err instanceof Error) {
    logger.error(
      `ErrorMiddleware: received an Error, fill error information to HTTP response`,
      ctx.contextID
    );
    logger.error(
      `ErrorMiddleware: ErrorName=${err.name} ErrorMessage=${
        err.message
      } ErrorStack=${err.stack}`
    );
    logger.error(`ErrorMiddleware: Set HTTP code: ${500}`, ctx.contextID);
    logger.error(
      `ErrorMiddleware: Set error message: ${err.message}`,
      ctx.contextID
    );
    logger.error(`ErrorMiddleware: Return HTTP body`, ctx.contextID);

    const totalTimeInMS = new Date().getTime() - ctx.startTime.getTime();
    logger.error(
      `ErrorMiddleware: End response. TotalTimeInMS=${totalTimeInMS} Headers=${JSON.stringify(
        res.getHeaders()
      )}`,
      ctx.contextID
    );

    res.status(500);
    res.send(err.message); // TODO: Format error body
    return;
  }

  logger.warn(
    `ErrorMiddleware: received unhandled error object`,
    ctx.contextID
  );

  next();
}
