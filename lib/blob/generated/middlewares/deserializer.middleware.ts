import { NextFunction, Request, Response } from "express";

import { getContextFromResponse } from "../IContext";
import * as Models from "../models";
import Operation from "../operation";

/**
 * Deserializer Middleware.
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export default function deserializerMiddleware(
  // tslint:disable-next-line:variable-name
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const ctx = getContextFromResponse(res);

  if (ctx.operation === Operation.Service_ListContainersSegment) {
    // TODO: Deserialize models
    const options: Models.IServiceListContainersSegmentOptionalParams = {
      prefix: "prefix",
    };
    ctx.handlerParameters = [options];
  }

  next();
}
