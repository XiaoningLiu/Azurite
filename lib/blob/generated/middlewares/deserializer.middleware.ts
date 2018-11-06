import { NextFunction, Request, Response } from "express";

import { getContextFromResponse } from "../IContext";
import Operation from "../operation";
import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
} from "../operation.specification";
import { deserialize } from "../utils/serializer";

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

  switch (ctx.operation!) {
    case Operation.Service_ListContainersSegment:
      deserialize(req, listContainersSegmentOperationSpec)
        .then((parameters) => {
          ctx.handlerParameters = parameters;
          next();
        })
        .catch(next);
      break;
    case Operation.Container_Create:
      deserialize(req, containerCreateOperationSpec)
        .then((parameters) => {
          ctx.handlerParameters = parameters;
          next();
        })
        .catch(next);
    default:
      break;
  }
}
