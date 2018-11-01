import express from "express";

import DBHandler from "./DBHandler";
import dispatchMiddleware from "./generated/dispatch.middleware";
import endMiddleware from "./generated/end.middleware";
import errorRequestHandler from "./generated/error.request.handler";
import HandlerMiddlewareFactory from "./generated/HandlerMiddlewareFactory";
import blobContextMiddleware from "./middlewares/blob.context.middleware";

const app = express();

app.use(dispatchMiddleware);
app.use(blobContextMiddleware);

// Validation

// Inject with different handlers
const handler = new DBHandler();
const handlerMiddlewares = new HandlerMiddlewareFactory(handler);

app.use(handlerMiddlewares.newHandlerMiddleware());
app.use(errorRequestHandler);
app.use(endMiddleware);
app.use((err: Error, _req: any, res: any) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
// Error handling

// tslint:disable-next-line:variable-name
app.all("/", (_req, res) => {
  res.send("Hello World");
});

export default app;
