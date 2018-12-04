import { NextFunction, Request, Response } from "express";

import HandlerError from "../HandlerError";

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
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }

  // Only handle ServerError, for other customized error types hand over to
  // other error handlers.
  if (err instanceof HandlerError) {
    res.status(err.statusCode);
    if (err.statusMessage) {
      res.statusMessage = err.statusMessage;
    }

    if (err.headers) {
      for (const key in err.headers) {
        if (err.headers.hasOwnProperty(key)) {
          const value = err.headers[key];
          if (value) {
            res.setHeader(key, value);
          }
        }
      }
    }

    console.error(`${err.name} ${err.message} ${err.statusCode}`);
    res.send(err.body);
  } else if (err instanceof Error) {
    console.error(`${err.name} ${err.message} ${500}`);
    res.status(500);
    res.send();
  }

  next();
}
