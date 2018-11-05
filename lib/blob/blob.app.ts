import express from "express";

import deserializerMiddleware from "./generated/middlewares/deserializer.middleware";
import dispatchMiddleware from "./generated/middlewares/dispatch.middleware";
import endMiddleware from "./generated/middlewares/end.middleware";
import errorMiddleware from "./generated/middlewares/error.middleware";
import HandlerMiddlewareFactory from "./generated/middlewares/HandlerMiddlewareFactory";
import serializerMiddleware from "./generated/middlewares/serializer.middleware";
import blobContextMiddleware from "./middlewares/blob.context.middleware";
import SimpleHandler from "./SimpleHandler";

const app = express();

// Create a SimpleHandler into handler middleware factory
// SimpleHandler implements IHandler interface, we can manually create different handlers
// Handler will take to persistency layer
const handlerMiddlewareFactory = new HandlerMiddlewareFactory(
  new SimpleHandler()
);

// Generated middlewares should follow strict orders
// Manually created middlewares can be injected into any points

app.use(dispatchMiddleware); // Generated
app.use(blobContextMiddleware); // Manually created
// TODO: Auth middleware // Manually created
app.use(deserializerMiddleware); // Generated
// TODO: Validation middleware // Manually created
app.use(handlerMiddlewareFactory.newHandlerMiddleware()); // Generated
app.use(serializerMiddleware); // Generated
app.use(errorMiddleware); // Generated
app.use(endMiddleware); // Generated, or manually created

export default app;
