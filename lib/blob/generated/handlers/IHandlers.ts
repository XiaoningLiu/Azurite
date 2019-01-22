import IContainerHandler from "./IContainerHandler";
import IServiceHandler from "./IServiceHandler";

export default interface IHandlers {
  serviceHandler: IServiceHandler;
  containerHandler: IContainerHandler;
}
