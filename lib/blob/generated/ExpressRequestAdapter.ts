import { Request } from "express";

import IRequest from "./IRequest";

export default class ExpressRequestAdapter implements IRequest {
  public readonly method:
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "PATCH";
  public readonly url: string;
  public readonly path: string;
  public readonly bodyStream: NodeJS.ReadableStream;

  public constructor(private readonly req: Request) {
    this.method = req.method.toUpperCase() as any;
    this.url = req.url;
    this.path = req.path;
    this.bodyStream = req;
  }

  public header(field: string): string | undefined {
    return this.req.header(field);
  }

  public query(key: string): string | undefined {
    return this.req.query[key];
  }
}
