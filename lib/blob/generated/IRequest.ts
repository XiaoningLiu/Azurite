export default interface IRequest {
  method:
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "PATCH";
  url: string;
  path: string;
  // headers: { [key: string]: string };
  bodyStream: NodeJS.ReadableStream;
  header(field: string): string | undefined;
  query(key: string): string | undefined;
}
