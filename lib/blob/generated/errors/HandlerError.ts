import { OutgoingHttpHeaders } from "http";

// TODO: Generate StorageError from swagger
export default class HandlerError extends Error {
  /**
   * Creates an instance of HandlerError.
   *
   * @param {number} statusCode HTTP response status code
   * @param {string} message Error message
   * @param {string} [statusMessage] HTTP response status message
   * @param {OutgoingHttpHeaders} [headers] HTTP response headers
   * @param {string} [body] HTTP response body
   * @memberof HandlerError
   */
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly statusMessage?: string,
    public readonly headers?: OutgoingHttpHeaders,
    public readonly body?: string
  ) {
    super(message);
    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, HandlerError.prototype);

    this.name = "ServerError";
  }
}
