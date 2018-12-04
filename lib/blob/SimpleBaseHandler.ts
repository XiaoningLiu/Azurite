import { IContainerItem } from "./generated/models";
import SimpleDataStore from "./SimpleDataStore";

/**
 * SimpleBaseHandler is a simple sample of the base handler class for inheried business handlers.
 *
 * BaseHandler class should maintain a singlton to persistency layer, such as maintain a database connection pool.
 * So every inherited classes instances can resuse the persistency layer connection.
 *
 * @export
 * @class SimpleHandler
 * @implements {IHandler}
 */
export default class SimpleBaseHandler {
  protected containers: { [key: string]: IContainerItem } = {};

  constructor(dataSource: SimpleDataStore) {
    this.containers = dataSource.containers;
  }
}
