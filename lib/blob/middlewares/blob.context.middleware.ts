import express, { NextFunction, Request, Response } from "express";

import ServerError from "../generated/ServerError";
import IBlobContext from "../IBlobContext";

const blobContextMiddleware: express.RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paths = req.path.split("/").filter((value) => value.length > 0);
  if (paths.length < 1) {
    // TODO: Error handling
    // TODO: Logging
    throw new ServerError(
      400,
      `Request URL doesn't include valid storage account name. Requested path is ${
        req.path
      }`
    );
  }

  const account = paths[0];
  const containerOrRootBlob = paths[1];
  const blob = paths[2];

  const ctx = res.locals.context as IBlobContext;
  ctx.account = account;
  ctx.container = containerOrRootBlob;
  ctx.blob = blob;

  next();
};

export default blobContextMiddleware;
