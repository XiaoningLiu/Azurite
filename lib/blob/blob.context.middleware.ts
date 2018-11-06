import { NextFunction, Request, Response } from "express";

import { getContextFromResponse } from "./generated/IContext";
import ServerError from "./generated/ServerError";
import { initializeBlobContext } from "./IBlobContext";

/**
 * BlobContextMiddleware is a middleware extract related blob service context
 * metadata into res.locals.context.
 *
 * This middleware should and only could be used after dispathMiddleware.
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export default function blobContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // TODO: Optimize container/blob name extraction alghrothim,
  // because blob names may contain special characters
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
  const container = paths[1];
  const blob = paths[2];

  // TODO: Generate xMsRequestID to the blob context
  const context = getContextFromResponse(res);
  initializeBlobContext(res, {
    ...context,
    account,
    blob,
    container,
    xMsRequestID: "",
  });

  next();
}
