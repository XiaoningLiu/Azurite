import IContext from "./generated/IContext";
import * as Models from "./generated/models";
import IBlobContext from "./IBlobContext";
import IContainerHandler from "./generated/handlers/IContainerHandler";
import SimpleBaseHandler from "./SimpleBaseHandler";
import ServerError from "./ServerError";

/**
 * Manually implement handlers by implementing IContainerHandler interface.
 * Handlers will take to persistency layer directly.
 *
 * @export
 * @class SimpleContainerHandler
 * @implements {IHandler}
 */
export default class SimpleContainerHandler extends SimpleBaseHandler
  implements IContainerHandler {
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
}
