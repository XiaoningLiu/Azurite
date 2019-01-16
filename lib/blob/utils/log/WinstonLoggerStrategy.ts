import { createLogger, format, Logger as IWinstonLogger, transports } from "winston";

import ILoggerStrategy from "./ILoggerStrategy";

export default class WinstonLoggerStrategy implements ILoggerStrategy {
  private winstonLogger: IWinstonLogger;

  public constructor(logfile?: string) {
    this.winstonLogger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      level: "silly",
      transports: [new transports.Console()],
    });

    if (logfile) {
      this.winstonLogger.transports.push(new transports.File({ filename: logfile }));
    }
  }

  public log(level: string, message: string): void {
    this.winstonLogger.log({ level, message });
  }
}
