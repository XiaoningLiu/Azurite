export default interface IResponse {
  status(code: number): IResponse;
  header(field: string, value?: string): IResponse;
  write(content: string | Buffer): IResponse;
  end(): void;
}
