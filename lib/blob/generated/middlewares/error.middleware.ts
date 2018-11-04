import { NextFunction, Request, Response } from "express";

import ServerError from "../ServerError";

export default function errorMiddleware(
  err: ServerError | Error,
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
  if (err instanceof ServerError) {
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

    res.send(err.body);
  }
}
