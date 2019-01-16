import { Request, Response } from "express";
import Context from "../Context";
import ILogger from "../utils/ILogger";

/**
 * End middleware is used to send out final HTTP response.
 *
 * @export
 * @param {Request} _req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {ILogger} logger A valid logger
 * @param {string} contextPath res.locals[contextPath] will be used to hold context
 */
export default function endMiddleware(_req: Request, res: Response, logger: ILogger, contextPath: string): void {
  const ctx = new Context(res.locals, contextPath);

  const totalTimeInMS = ctx.startTime ? new Date().getTime() - ctx.startTime.getTime() : undefined;
  logger.info(
    `EndMiddleware: End response. TotalTimeInMS=${totalTimeInMS} StatusCode=${res.statusCode} StatusMessage=${
      res.statusMessage
    } Headers=${JSON.stringify(res.getHeaders())}`,
    ctx.contextID
  );

  res.end();
}
