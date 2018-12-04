import ServerError from "./ServerError";

/**
 * Create customized error types by inheriting ServerError
 *
 * @export
 * @class UnimplementedError
 * @extends {ServerError}
 */
export default class NotImplementedError extends ServerError {}
