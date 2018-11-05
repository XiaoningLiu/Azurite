import { NextFunction, Request, Response } from "express";

import { deserialize } from "../../utils/serializer";
import { getContextFromResponse } from "../IContext";
import Operation from "../operation";
import { listContainersSegmentOperationSpec } from "../operation.specification";

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
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const ctx = getContextFromResponse(res);

  if (ctx.operation === Operation.Service_ListContainersSegment) {
    deserialize(req, listContainersSegmentOperationSpec)
      .then((parameters) => {
        ctx.handlerParameters = parameters;
        next();
      })
      .catch(next);
  }
}
