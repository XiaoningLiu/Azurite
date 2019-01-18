import { OutgoingHttpHeaders } from "http";

export default interface IResponse {
  setStatusCode(code: number): IResponse;
  getStatusCode(): number;
  setStatusMessage(message: string): IResponse;
  getStatusMessage(): string;
  setHeader(
    field: string,
    value?: string | string[] | undefined | number
  ): IResponse;
  getHeaders(): OutgoingHttpHeaders;
  headersSent(): boolean;
  setContentType(value: string | undefined): IResponse;
  write(chunk: any, cb?: (error: Error | null | undefined) => void): boolean;
  write(
    chunk: any,
    encoding?: string,
    cb?: (error: Error | null | undefined) => void
  ): boolean;
  end(cb?: () => void): void;
}
