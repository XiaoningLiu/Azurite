export declare type Callback = (...arguments: any[]) => any;
declare type NextFunction = Callback | Promise<any>;

export default NextFunction;
