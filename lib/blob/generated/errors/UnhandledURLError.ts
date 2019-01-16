import HandlerError from "./HandlerError";

export default class UnhandledURLError extends HandlerError {
  public constructor() {
    super(
      400,
      "Incoming URL doesn't match any of swagger path patterns. Or no context.operation provided in dispatchMiddleware"
    );
    this.name = "UnhandledURLError";
  }
}
