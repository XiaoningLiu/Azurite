import Operation from "./Operation";

export interface IHandlerParameters {
  [key: string]: any;
}

/**
 * Context holds generated server context information.
 * Every incoming HTTP request will initialize a new context.
 *
 * @export
 * @class Context
 */
export default class Context {
  public readonly holder: any;
  public readonly path: string;

  /**
   * Creates an instance of Context.
   * Context holds generated server context information.
   * Every incoming HTTP request will initialize a new context.
   *
   * @param {Context} context An existing Context
   * @memberof Context
   */
  public constructor(context: Context);
  /**
   * Creates an instance of Context.
   * Context holds generated server context information.
   * Every incoming HTTP request will initialize a new context.
   *
   * @param {Object} holder Holder is an Object which used to keep context information
   * @param {string} [path="context"] holder[path] is used as context object by default
   * @memberof Context
   */
  // tslint:disable-next-line:ban-types
  public constructor(holder: Object, path: string);
  public constructor(
    // tslint:disable-next-line:ban-types
    holderOrContext: Object | Context,
    path: string = "context"
  ) {
    if (holderOrContext instanceof Context) {
      this.holder = holderOrContext.holder;
      this.path = holderOrContext.path;
    } else {
      this.holder = holderOrContext as any;
      this.path = path;

      if (this.holder[this.path] === undefined) {
        this.holder[this.path] = {};
      }

      if (typeof this.holder[this.path] !== "object") {
        throw new Error(
          `Initialize Context error because holder.${
            this.path
          } is not a object.`
        );
      }
    }
  }

  public get operation(): Operation | undefined {
    return this.holder.operation;
  }

  public set operation(operation: Operation | undefined) {
    this.holder.operation = operation;
  }

  public get handlerParameters(): IHandlerParameters | undefined {
    return this.holder.handlerParameters;
  }

  public set handlerParameters(
    handlerParameters: IHandlerParameters | undefined
  ) {
    this.holder.handlerParameters = handlerParameters;
  }

  public get handlerResponses(): any {
    return this.holder.handlerResponses;
  }

  public set handlerResponses(handlerResponses: any) {
    this.holder.handlerResponses = handlerResponses;
  }

  public get contextID(): string | undefined {
    return this.holder.contextID;
  }

  public set contextID(contextID: string | undefined) {
    this.holder.contextID = contextID;
  }
}
