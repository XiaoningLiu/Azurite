import { NextFunction, Request, Response } from "express";

import { getContextFromResponse } from "../IContext";
import Operation from "../operation";
import {
  containerCreateOperationSpec,
  listContainersSegmentOperationSpec,
} from "../operation.specification";
import { serialize } from "../utils/serializer";

/**
 * serializerMiddleware
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export default function serializerMiddleware(
  // tslint:disable-next-line:variable-name
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const ctx = getContextFromResponse(res);

  switch (ctx.operation!) {
    case Operation.Service_ListContainersSegment:
      serialize(res, listContainersSegmentOperationSpec, ctx.handlerResponses)
        .then(() => {
          next();
        })
        .catch(next);
      break;
    case Operation.Container_Create:
      serialize(res, containerCreateOperationSpec, ctx.handlerResponses)
        .then(() => {
          next();
        })
        .catch(next);
    default:
      break;
  }
}
