import { ErrorRequestHandler, NextFunction, Request } from "express";

import { Response } from "express-serve-static-core";
import ServerError from "./ServerError";

const errorRequestHandler: ErrorRequestHandler = (
  err: ServerError | Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

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
};

export default errorRequestHandler;
