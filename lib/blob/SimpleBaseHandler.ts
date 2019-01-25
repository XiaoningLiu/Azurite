import { ContainerItem } from "./generated/artifacts/models";
import SimpleDataStore from "./SimpleDataStore";

/**
 * SimpleBaseHandler is a simple sample of the base handler class for inherited business handlers.
 *
 * BaseHandler class should maintain a singleton to persistency layer, such as maintain a database connection pool.
 * So every inherited classes instances can reuse the persistency layer connection.
 *
 * @export
 * @class SimpleHandler
 * @implements {IHandler}
 */
export default class SimpleBaseHandler {
  protected containers: { [key: string]: ContainerItem } = {};

  constructor(dataSource: SimpleDataStore) {
    this.containers = dataSource.containers;
  }
}
