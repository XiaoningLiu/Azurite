import * as http from "http";

import app from "./blob.app";

// Decouple server & app layer
// Server layer will config sever related configurations, like port etc.
const server = http.createServer(app);

// TODO: Apply a configure module
server.listen(10000, "", () => {
  // TODO: Apply a logger module
  // tslint:disable-next-line:no-console
  console.log(`[Azurite][Blob] Server successfully listens on ${10000}`);
});
