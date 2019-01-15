import ILogger from "../../generated/ILogger";
import ILoggerStrategy from "./ILoggerStrategy";
import WinstonLoggerStrategy from "./WinstonLoggerStrategy";

export class Logger implements ILogger {
  public constructor(private strategy: ILoggerStrategy) {}

  public error(message: string, contextID?: string) {
    this.strategy.log(
      "error",
      contextID ? `${message} CONTEXT_ID=${contextID}` : message
    );
  }
  public warn(message: string, contextID?: string) {
    this.strategy.log(
      "warn",
      contextID ? `${message} CONTEXT_ID=${contextID}` : message
    );
  }
  public info(message: string, contextID?: string) {
    this.strategy.log(
      "info",
      contextID ? `${message} CONTEXT_ID=${contextID}` : message
    );
  }
  public verbose(message: string, contextID?: string) {
    this.strategy.log(
      "verbose",
      contextID ? `${message} CONTEXT_ID=${contextID}` : message
    );
  }
  public debug(message: string, contextID?: string) {
    this.strategy.log(
      "debug",
      contextID ? `${message} CONTEXT_ID=${contextID}` : message
    );
  }
}

const logger = new Logger(new WinstonLoggerStrategy());
export default logger;
