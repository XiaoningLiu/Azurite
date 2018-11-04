// TODO: Define logger interface
// Think: generated code and manually code share same logger interface?
export enum Level {
  ERROR = 0,
}

export default interface ILogger {
  error(level: Level): any;
}
