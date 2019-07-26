#!/usr/bin/env node
import { access } from "fs";
import { dirname, join } from "path";
import { promisify } from "util";

import Environment from "../common/Environment";
import * as Logger from "../common/Logger";
import { StoreDestinationArray } from "../common/persistence/IExtentStore";
import BlobServer from "./BlobServer";
import LokiBlobConfiguration from "./LokiBlobConfiguration";
import {
  DEFAULT_BLOB_DB_PATH,
  DEFAULT_BLOB_PERSISTENCE_PATH,
  DEFAULT_EXTENT_DB_PATH
} from "./utils/constants";

// tslint:disable:no-console

const accessAsync = promisify(access);

/**
 * Entry for Azurite blob service.
 */
async function main() {
  // Initialize and validate environment values from command line parameters
  const env = new Environment();
  const location = await env.location();
  await accessAsync(location);
  if (env.debug() !== undefined) {
    await accessAsync(dirname(env.debug()!));
  }

  // Initialize server configuration
  const persistenceArray: StoreDestinationArray = [
    {
      persistenceId: "Default",
      persistencePath: join(location, DEFAULT_BLOB_PERSISTENCE_PATH),
      maxConcurrency: 1
    }
  ];

  const config = new LokiBlobConfiguration(
    env.blobHost(),
    env.blobPort(),
    join(location, DEFAULT_BLOB_DB_PATH),
    join(location, DEFAULT_EXTENT_DB_PATH),
    persistenceArray,
    !env.silent(),
    undefined,
    env.debug() !== undefined,
    env.debug()
  );

  // We use logger singleton as global debugger logger to track detailed outputs cross layers
  // Note that, debug log is different from access log which is only available in request handler layer to
  // track every request. Access log is not singleton, and initialized in specific RequestHandlerFactory implementations
  // Enable debug log by default before first release for debugging purpose
  Logger.configLogger(config.enableDebugLog, config.debugLogFilePath);

  // Create server instance
  const server = new BlobServer(config);

  // Start server
  console.log(
    `Azurite Blob service is starting on ${config.host}:${config.port}`
  );
  await server.start();
  console.log(
    `Azurite Blob service successfully listens on ${server.getHttpServerAddress()}`
  );

  // Handle close event
  const beforeCloseMessage = `Azurite Blob service is closing...`;
  const afterCloseMessage = `Azurite Blob service successfully closed`;
  process
    .once("message", msg => {
      if (msg === "shutdown") {
        console.log(beforeCloseMessage);
        server.close().then(() => {
          console.log(afterCloseMessage);
        });
      }
    })
    .once("SIGINT", () => {
      console.log(beforeCloseMessage);
      server.close().then(() => {
        console.log(afterCloseMessage);
      });
    });
}

main().catch(err => {
  console.error(`Exit due to unhandled error: ${err.message}`);
  process.exit(1);
});
