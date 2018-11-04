import { OutgoingHttpHeaders } from "http";

export default class ServerError extends Error {
  public statusCode: number;
  public body?: string;
  public statusMessage?: string;
  public headers?: OutgoingHttpHeaders;

  constructor(
    statusCode: number,
    message: string,
    statusMessage?: string,
    headers?: OutgoingHttpHeaders,
    body?: string
  ) {
    super(message);
    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, ServerError.prototype);

    this.name = "ServerError";
    this.message = message;
    this.statusCode = statusCode;
    (this.statusMessage = statusMessage), (this.headers = headers);
    this.body = body;
  }
}
