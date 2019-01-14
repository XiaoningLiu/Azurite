import {
  Logger as IWinstonLogger,
  createLogger,
  format,
  transports,
} from "winston";

import ILoggerStrategy from "./ILoggerStrategy";

export default class WinstonLoggerStrategy implements ILoggerStrategy {
  private winstonLogger: IWinstonLogger;

  public constructor() {
    this.winstonLogger = createLogger({
      level: "silly",
      format: format.combine(
        format.timestamp(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: "combined.log" }),
      ],
    });
  }

  public log(level: string, message: string): void {
    this.winstonLogger.log({ level, message });
  }
}
