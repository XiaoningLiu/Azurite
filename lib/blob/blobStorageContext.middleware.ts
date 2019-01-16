import { NextFunction, Request, Response } from "express";

import BlobStorageContext from "./BlobStorageContext";
import { CONTEXT_PATH } from "./constants";
import logger from "./utils/log/Logger";

/**
 * A middleware extract related blob service context.
 *
 * @export
 * @param {Request} req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {NextFunction} next An express middleware next callback
 */
export default function blobStorageContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  // TODO: Use GUID for a server request ID
  const requestID = new Date().getTime().toString();

  const blobContext = new BlobStorageContext(res.locals, CONTEXT_PATH);
  blobContext.xMsRequestID = requestID;
  blobContext.startTime = new Date();

  logger.verbose(`BlobStorageContextMiddleware: Initialized blob storage context...`, requestID);
  logger.info(
    `BlobStorageContextMiddleware: RequestURL=${req.url} RequestHeaders:${JSON.stringify(req.headers)} ClientIP=${
      req.ip
    } Protocol=${req.protocol} HTTPVersion=${req.httpVersion}`,
    requestID
  );

  // TODO: Optimize container/blob name extraction algorithm,
  // because blob names may contain special characters
  const paths = req.path.split("/").filter((value) => value.length > 0);
  // if (paths.length < 1) {
  //   const handlerError = new StorageServerError(
  //     400,
  //     "InvalidQueryParameterValue",
  //     `Value for one of the query parameters specified in the request URI is invalid`,
  //     blobContext.contextID!
  //   );

  //   logger.error(`BlobStorageContextMiddleware: BlobStorageContextMiddleware: ${handlerError.message}`, requestID);

  //   throw handlerError;
  // }

  const account = paths[0];
  const container = paths[1];
  const blob = paths[2];

  blobContext.account = account;
  blobContext.container = container;
  blobContext.blob = blob;

  logger.info(`BlobStorageContextMiddleware: Account:=${account} Container=${container} Blob=${blob}`, requestID);
  next();
}
