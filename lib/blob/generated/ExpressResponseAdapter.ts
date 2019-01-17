import { Response } from "express";
import { OutgoingHttpHeaders } from "http";

import IResponse from "./IResponse";

declare type StreamWriteCallback = (error: Error | null | undefined) => void;

export default class ExpressResponseAdapter implements IResponse {
  public constructor(private readonly res: Response) {}

  public setStatusCode(code: number): IResponse {
    this.res.status(code);
    return this;
  }

  public getStatusCode(): number {
    return this.res.statusCode;
  }

  public setStatusMessage(message: string): IResponse {
    this.res.statusMessage = message;
    return this;
  }

  public setHeader(
    field: string,
    value?: string | string[] | undefined
  ): IResponse {
    if (typeof value === "number") {
      value = `${value}`;
    }

    // Cannot remove if block because of a potential TypeScript bug
    if (typeof value === "string") {
      this.res.set(field, value);
    } else {
      this.res.set(field, value);
    }
    return this;
  }

  public getHeaders(): OutgoingHttpHeaders {
    return this.res.getHeaders();
  }

  public headersSent(): boolean {
    return this.res.headersSent;
  }

  public setContentType(value: string): IResponse {
    this.res.contentType(value);
    return this;
  }

  public write(
    chunk: any,
    cb?: (error: Error | null | undefined) => void
  ): boolean;
  public write(
    chunk: any,
    encoding?: string,
    cb?: StreamWriteCallback
  ): boolean;
  public write(
    chunk: any,
    encodingOrCallback?: string | StreamWriteCallback,
    cb?: StreamWriteCallback
  ): boolean {
    if (encodingOrCallback && typeof encodingOrCallback === "function") {
      return this.res.write(chunk, encodingOrCallback);
    } else {
      return this.res.write(chunk, encodingOrCallback, cb);
    }
  }

  public end(cb?: () => void): void {
    this.res.end(cb);
  }
}
