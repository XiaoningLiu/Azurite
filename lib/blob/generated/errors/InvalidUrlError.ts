import MiddlewareError from "./MiddlewareError";

export default class InvalidUrlError extends MiddlewareError {
  public constructor() {
    super(
      400,
      "Incoming URL doesn't match any of swagger path patterns. Or no context.operation provided in dispatchMiddleware."
    );
    this.name = "UnhandledURLError";
  }
}
