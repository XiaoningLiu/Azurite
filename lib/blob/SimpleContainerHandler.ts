import BlobStorageContext from "./BlobStorageContext";
import Context from "./generated/Context";
import IContainerHandler from "./generated/handlers/IContainerHandler";
import * as Models from "./generated/models";
import SimpleBaseHandler from "./SimpleBaseHandler";
import StorageServerError from "./StorageServerError";

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
    context: Context
  ): Promise<Models.IContainerCreateHeaders> {
    const blobCtx = new BlobStorageContext(context);

    if (this.containers[blobCtx.container!]) {
      throw new StorageServerError(
        409,
        "ContainerAlreadyExists",
        "The specified container already exists.",
        context.contextID!
      );
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
