import express from "express";

import blobContextMiddleware from "./blob.context.middleware";
import deserializerMiddleware from "./generated/middlewares/deserializer.middleware";
import dispatchMiddleware from "./generated/middlewares/dispatch.middleware";
import endMiddleware from "./generated/middlewares/end.middleware";
import errorMiddleware from "./generated/middlewares/error.middleware";
import HandlerMiddlewareFactory from "./generated/middlewares/HandlerMiddlewareFactory";
import serializerMiddleware from "./generated/middlewares/serializer.middleware";
import SimpleServiceHandler from "./SimpleServiceHandler";
import SimpleContainerHandler from "./SimpleContainerHandler";
import SimpleDataStore from "./SimpleDataStore";

const app = express();

// Create a SimpleHandler into handler middleware factory
// SimpleHandler implements IHandler interface, we can manually create different handlers
// Handler will take to persistency layer
const dataSource = new SimpleDataStore();
const handlerMiddlewareFactory = new HandlerMiddlewareFactory(
  new SimpleServiceHandler(dataSource),
  new SimpleContainerHandler(dataSource)
);

// Generated middlewares should follow strict orders
// Manually created middlewares can be injected into any points

app.use(dispatchMiddleware); //                              Generated;
app.use(blobContextMiddleware); //                           Manually created; generator doesn't know
// TODO: Auth middleware //                                  Manually created
app.use(deserializerMiddleware); //                          Generated; will do basic validation defined in swagger
// TODO: Validation middleware //                            Manually created
app.use(handlerMiddlewareFactory.newHandlerMiddleware()); // Generated
app.use(serializerMiddleware); //                            Generated
app.use(errorMiddleware); //                                 Generated
app.use(endMiddleware); //                                   Generated, or manually created

export default app;
