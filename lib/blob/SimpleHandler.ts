import IContext from "./generated/IContext";
import IHandler from "./generated/IHandler";
import * as Models from "./generated/models";
import { IContainerItem } from "./generated/models";
import ServerError from "./generated/ServerError";
import IBlobContext from "./IBlobContext";

/**
 * Manually implement handlers by implementing IHandler interface.
 * Handlers will take to persistency layer directly.
 *
 * @export
 * @class SimpleHandler
 * @implements {IHandler}
 */
export default class SimpleHandler implements IHandler {
  private containers: { [key: string]: IContainerItem } = {};

  public async containerCreate(
    options: Models.IContainerCreateOptionalParams,
    context: IContext
  ): Promise<Models.IContainerCreateHeaders> {
    const blobCtx = context as IBlobContext;
    if (this.containers[blobCtx.container!]) {
      throw new ServerError(409, "Container exists");
    }

    const lastModified = new Date();
    const etag = "newEtag";

    this.containers[blobCtx.container!] = {
      metadata: options.metadata,
      name: blobCtx.container!,
      properties: {
        etag,
        lastModified,
      },
    };

    const result: Models.IContainerCreateHeaders = {
      lastModified,
    };

    return result;
  }

  public async serviceListContainersSegment(
    options: Models.IServiceListContainersSegmentOptionalParams
  ): Promise<Models.IServiceListContainersSegmentResponse> {
    const containerArray = [];
    for (const key in this.containers) {
      if (this.containers.hasOwnProperty(key)) {
        const container = this.containers[key];
        containerArray.push(container);
      }
    }

    const res: Models.IServiceListContainersSegmentResponse = {
      containerItems: containerArray,
      maxResults: options.maxresults || 2000,
      nextMarker: "",
      prefix: options.prefix || "",
      serviceEndpoint: "serviceEndpoint",
    };
    return res;
  }
}
