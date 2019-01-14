import ILoggerStrategy from "./ILoggerStrategy";
import WinstonLoggerStrategy from "./WinstonLoggerStrategy";

export class Logger {
  public constructor(private strategy: ILoggerStrategy) {}

  public error(message: string) {
    this.strategy.log("error", message);
  }
  public warn(message: string) {
    this.strategy.log("warn", message);
  }
  public info(message: string) {
    this.strategy.log("info", message);
  }
  public verbose(message: string) {
    this.strategy.log("verbose", message);
  }
  public debug(message: string) {
    this.strategy.log("debug", message);
  }
}

const logger = new Logger(new WinstonLoggerStrategy());
export default logger;
