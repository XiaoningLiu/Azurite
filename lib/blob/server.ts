import * as http from "http";

import app from "./app";
import { SERVER_CONFIGS } from "./constants";
import logger from "./utils/log/Logger";

// Decouple server & app layer
// Server layer should only care about sever related configurations, like listening port etc.
const server = http.createServer(app);

const port = SERVER_CONFIGS.LISTENING_PORT;
const host = SERVER_CONFIGS.HOST_NAME;

server.listen(port, host, () => {
  let address = server.address();
  if (typeof address !== "string") {
    address = address.address;
  }

  logger.info(`Azurite Blob service successfully listens on ${address}:${port}`);
});
