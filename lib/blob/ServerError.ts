import HandlerError from "./generated/HandlerError";
import { OutgoingHttpHeaders } from "http";

export default class ServerError extends HandlerError {
  constructor(
    statusCode: number,
    message: string,
    statusMessage?: string,
    headers?: OutgoingHttpHeaders,
    body?: string
  ) {
    super(statusCode, message, statusMessage, headers, body);

    // TODO: Construct Azure Storage XML body according to error messages
  }
}
