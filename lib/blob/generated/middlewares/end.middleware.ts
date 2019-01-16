import { Request, Response } from "express";
import Context from "../Context";
import ILogger from "../ILogger";

/**
 * End middleware is used to send out final HTTP response.
 * TODO: Move it to outside of generated scope code?
 *
 * @export
 * @param {Request} _req
 * @param {Response} res
 */
// tslint:disable-next-line:variable-name
export default function endMiddleware(
  _req: Request,
  res: Response,
  logger: ILogger,
  contextPath: string
): void {
  const ctx = new Context(res.locals, contextPath);

  const totalTimeInMS = new Date().getTime() - ctx.startTime.getTime();
  logger.info(
    `EndMiddleware: End response. TotalTimeInMS=${totalTimeInMS} Headers=${JSON.stringify(
      res.getHeaders()
    )}`,
    ctx.contextID
  );

  res.end();
}
