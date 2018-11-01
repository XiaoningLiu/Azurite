import IContext from "./generated/IContext";

interface IBlobContext extends IContext {
  account: string;
  container?: string;
  blob?: string;
}

export default IBlobContext;
