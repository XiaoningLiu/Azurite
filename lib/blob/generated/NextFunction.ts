export declare type Callback = (...arguments: any[]) => any;
// TODO: Support Koa async middleware and async error handling later
declare type NextFunction = Callback /*| Promise<any>*/;

export default NextFunction;
