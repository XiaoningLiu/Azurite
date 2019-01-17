import StorageServerError from "./StorageServerError";

/**
 * Create customized error types by inheriting ServerError
 *
 * @export
 * @class UnimplementedError
 * @extends {StorageServerError}
 */
export default class NotImplementedError extends StorageServerError {
  public constructor() {
    super(500, "APINotImplemented", "Current API is not implemented yet.", "");
  }
}
