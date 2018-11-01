import express, { NextFunction, Request, Response } from "express";

import IContext from "./IContext";
import Operation from "./operation";
import ServerError from "./ServerError";

const dispatchMiddleware: express.RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  res.locals.context = {};
  const ctx = res.locals.context as IContext;

  if (req.method.toUpperCase() === "GET" && req.query.comp === "list") {
    ctx.operation = Operation.Service_ListContainersSegment;
  }

  if (!ctx.operation) {
    console.error(
      `Cannot identify current operation. Please use "dispatchMiddleware" before "handlerMiddleware".`
    );
    return next(
      new ServerError(500, "Internal Server Error", undefined, undefined)
    );
  }

  next();
};

export default dispatchMiddleware;
