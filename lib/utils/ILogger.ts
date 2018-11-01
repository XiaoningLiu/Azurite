export enum Level {
  ERROR = 0,
}

export default interface ILogger {
  error(level: Level): any;
}
