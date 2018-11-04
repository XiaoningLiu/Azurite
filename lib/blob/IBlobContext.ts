import { Response } from "express";

import IContext, {
  getContextFromResponse,
  initializeContext,
} from "./generated/IContext";

/**
 * BlobContext hosts metadatas through the life of every Blob REST API call.
 * Use res.locals.context as the context object path, call getBlobContextFromResponse()
 * to get a context object.
 *
 * @interface IBlobContext
 * @extends {IContext}
 */
interface IBlobContext extends IContext {
  account: string;
  container?: string;
  blob?: string;
  xMsRequestID: string;
}

/**
 * Initialize BlobContext to express Response object,
 * res.locals.context will be created if it's undefined.
 *
 * @param {Response} res An express response object.
 */
export function initializeBlobContext(
  res: Response,
  blobContext: IBlobContext
) {
  initializeContext(res, blobContext);

  const ctx = res.locals.context as IBlobContext;
  ctx.account = blobContext.account;
  ctx.container = blobContext.container;
  ctx.blob = blobContext.blob;
  ctx.xMsRequestID = blobContext.xMsRequestID;
}

/**
 * Get IBlobContext object from an existing express Response object.
 *
 * @export
 * @param {Response} res An express response object.
 * @returns {IBlobContext}
 */
export function getBlobContextFromResponse(res: Response): IBlobContext {
  const blobContext = getContextFromResponse(res) as IBlobContext;
  if (!blobContext.account || !blobContext.xMsRequestID) {
    throw new TypeError(
      `res.locals.context is not a valid IBlobContext object, because it doesn't include required properties.\
      Make sure it has been initilized by calling initializeBlobContext().`
    );
  }
  return blobContext;
}

export default IBlobContext;
