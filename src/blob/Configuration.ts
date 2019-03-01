import {
  DEFAULT_BLOB_PERSISTENCE_PATH,
  DEFAULT_LOKI_DB_PATH,
  DEFAULT_SERVER_HOST_NAME,
  DEFAULT_SERVER_LISTENING_PORT,
} from "./utils/constants";

/**
 * Handle Azurite all configurations.
 *
 * @export
 * @class Configuration
 */
export default class Configuration {
  public readonly host: string;
  public readonly port: number;
  public readonly dbPath?: string;
  public readonly persistencePath?: string;

  // TODO: Add an overload constructor to parsing configurations from command line arguments or environment variables
  public constructor() {
    this.host = DEFAULT_SERVER_HOST_NAME;
    this.port = DEFAULT_SERVER_LISTENING_PORT;
    this.dbPath = DEFAULT_LOKI_DB_PATH;
    this.persistencePath = DEFAULT_BLOB_PERSISTENCE_PATH;
  }
}
