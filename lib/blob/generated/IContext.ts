import { Response } from "express";

import Operation from "./operation";

export interface IHandlerParameters {
  [key: string]: any;
}

export declare type ParameterPath =
  | string
  | string[]
  | {
      [propertyName: string]: ParameterPath;
    };

/**
 * Context to host metadata through the life of every REST API call.
 * Use res.locals.context as the context object path, call getContextFromResponse()
 * to get a context object.
 *
 * @interface IContext
 */
export default interface IContext {
  operation?: Operation;
  handlerParameters?: IHandlerParameters;
  handlerResponses?: any; // TODO: Inherit a global HTTPResponse object to control HTTP details
}

/**
 * Initialize Context to express Response object,
 * res.locals.context will be created if it's undefined.
 *
 * ALL properties of context will be OVERRIDE by the context parameter!
 *
 * @export
 * @param {Response} res An express response object.
 * @param {IContext} context ALL properties of context will be OVERRIDE by the context parameter!
 */
export function initializeContext(res: Response, context: IContext) {
  if (!res || !res.locals) {
    throw new TypeError(
      `res object is invalid or doesn't include locals property.`
    );
  }

  if (!res.locals.context) {
    res.locals.context = {};
  }

  const ctx = res.locals.context as IContext;
  ctx.operation = context.operation;
  ctx.handlerParameters = context.handlerParameters;
  ctx.handlerResponses = context.handlerResponses;
}

/**
 * Get IContext object from an existing express Response object.
 * If res.locals.context is null, will assign {} to it.
 *
 * @export
 * @param {Response} res An express response object.
 * @returns {IContext}
 */
export function getContextFromResponse(res: Response): IContext {
  if (!res || !res.locals) {
    throw new TypeError(
      `res object is invalid or doesn't include locals property.`
    );
  }

  if (!res.locals.context) {
    throw new TypeError(
      `res.locals.context is undefined. Make sure it has been initialized by calling initializeContext().`
    );
  }

  const context = res.locals.context as IContext;
  return context;
}
