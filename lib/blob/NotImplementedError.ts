import StorageServerError from "./StorageServerError";

/**
 * Create customized error types by inheriting ServerError
 *
 * @export
 * @class UnimplementedError
 * @extends {StorageServerError}
 */
export default class NotImplementedError extends StorageServerError {}
