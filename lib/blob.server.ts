import * as http from "http";

import app from "./blob.app";

const server = http.createServer(app);

// TODO: Apply configure
server.listen(10000, "", () => {
  // TODO: Logger
  console.log(`[Azurite][Blob] Server successfully listens on ${10000}`);
});
