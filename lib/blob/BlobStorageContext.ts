import Context from "./generated/Context";

export default class BlobStorageContext extends Context {
  public getContainer(): string | undefined {
    return this.holder.container;
  }

  public get account(): string | undefined {
    return this.holder.account;
  }

  public set account(account: string | undefined) {
    this.holder.account = account;
  }

  public get container(): string | undefined {
    return this.holder.container;
  }

  public set container(container: string | undefined) {
    this.holder.container = container;
  }

  public get blob(): string | undefined {
    return this.holder.blob;
  }

  public set blob(blob: string | undefined) {
    this.holder.blob = blob;
  }

  public get xMsRequestID(): string | undefined {
    return this.contextID;
  }

  public set xMsRequestID(xMsRequestID: string | undefined) {
    this.contextID = xMsRequestID;
  }
}
