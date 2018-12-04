import { IContainerItem } from "./generated/models";

/**
 * This is a simple sample of persistency layer data source.
 *
 * @export
 * @class SimpleDataStore
 */
export default class SimpleDataStore {
  public containers: { [key: string]: IContainerItem } = {};
}
