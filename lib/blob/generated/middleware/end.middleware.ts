import Context from "../Context";
import IResponse from "../IResponse";
import ILogger from "../utils/ILogger";

/**
 * End middleware is used to send out final HTTP response.
 *
 * @export
 * @param {Request} _req An express compatible Request object
 * @param {Response} res An express compatible Response object
 * @param {ILogger} logger A valid logger
 * @param {Context} context res.locals[contextPath] will be used to hold context
 */
export default function endMiddleware(
  res: IResponse,
  logger: ILogger,
  context: Context
): void {
  const totalTimeInMS = context.startTime
    ? new Date().getTime() - context.startTime.getTime()
    : undefined;

  logger.info(
    // tslint:disable-next-line:max-line-length
    `EndMiddleware: End response. TotalTimeInMS=${totalTimeInMS} StatusCode=${res.getStatusCode()} StatusMessage=${res.getStatusMessage()} Headers=${JSON.stringify(
      res.getHeaders()
    )}`,
    context.contextID
  );

  res.getBodyStream().end();
}
