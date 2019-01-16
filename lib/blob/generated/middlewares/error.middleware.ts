import { NextFunction, Request, Response } from "express";

import Context from "../Context";
import HandlerError from "../HandlerError";
import ILogger from "../ILogger";

/**
 * ErrorMiddleware handles following 2 kinds of errors thrown from previous middleware or handlers:
 *
 * 1. HandlerError will be serialized.
 *    This includes most of expected errors, such as 4XX or some 5xx errors are HandlerError.
 *
 * 2. Other unexpected errors will be serialized to 500 Internal Server error directly.
 *    Every this kind of error should be carefully checked, and consider to handle it as a HandlerError.
 *
 * @export
 * @param {(HandlerError | Error)} err A HandlerError or Error object
 * @param {Request} _req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {NextFunction} next An express middleware next callback
 * @param {ILogger} logger A valid logger
 * @param {string} contextPath res.locals[contextPath] will be used to hold context
 * @returns {void}
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

    logger.error(
      `ErrorMiddleware: Set content type: application/xml`,
      ctx.contextID
    );
    res.contentType(`application/xml`);

    logger.error(`ErrorMiddleware: Set HTTP body: ${err.body}`, ctx.contextID);
    if (err.body) {
      res.write(err.body);
    }
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

    res.status(500);
    res.write(err.message);
  } else {
    logger.warn(
      `ErrorMiddleware: received unhandled error object`,
      ctx.contextID
    );
  }

  next();
}
