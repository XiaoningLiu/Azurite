import express from "express";

import blobStorageContextMiddleware from "./blobStorageContext.middleware";
import { CONTEXT_PATH } from "./constants";
import endMiddleware from "./generated/middlewares/end.middleware";
import errorMiddleware from "./generated/middlewares/error.middleware";
import HandlerMiddlewareFactory from "./generated/middlewares/HandlerMiddlewareFactory";
import MiddlewareFactory from "./generated/middlewares/MiddlewareFactory";
import serializerMiddleware from "./generated/middlewares/serializer.middleware";
import SimpleContainerHandler from "./SimpleContainerHandler";
import SimpleDataStore from "./SimpleDataStore";
import SimpleServiceHandler from "./SimpleServiceHandler";
import logger from "./utils/log/Logger";

const app = express();

const middlewareFactory = new MiddlewareFactory(logger, CONTEXT_PATH);

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

app.use(blobStorageContextMiddleware); //                    Manually created; generator doesn't know
app.use(middlewareFactory.createDispatchMiddleware()); //    Generated;
// TODO: Auth middleware //                                  Manually created
app.use(middlewareFactory.createDeserializerMiddleware()); //Generated; will do basic validation defined in swagger
// TODO: Validation middleware //                            Manually created
app.use(handlerMiddlewareFactory.newHandlerMiddleware()); // Generated
app.use(serializerMiddleware); //                            Generated
app.use(errorMiddleware); //                                 Generated
app.use(endMiddleware); //                                   Generated, or manually created

export default app;
