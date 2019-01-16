import express from "express";

import blobStorageContextMiddleware from "./blobStorageContext.middleware";
import { CONTEXT_PATH } from "./constants";
import MiddlewareFactory from "./generated/middlewares/MiddlewareFactory";
import SimpleContainerHandler from "./SimpleContainerHandler";
import SimpleDataStore from "./SimpleDataStore";
import SimpleServiceHandler from "./SimpleServiceHandler";
import logger from "./utils/log/Logger";

const app = express();

// MiddlewareFactory is a factory to create auto-generated middleware
const middlewareFactory = new MiddlewareFactory(logger, CONTEXT_PATH);

// Create a SimpleHandler into handler middleware factory
// SimpleHandler implements IHandler interface, we can manually create different handlers
// Handler will take to persistency layer
const dataSource = new SimpleDataStore();
const handlers = {
  containerHandler: new SimpleContainerHandler(dataSource),
  serviceHandler: new SimpleServiceHandler(dataSource),
};

/*
 * Generated middleware should follow strict orders
 * Manually created middleware can be injected into any points
 */

// Manually created middleware to deserialize feature related context which swagger doesn't know
app.use(blobStorageContextMiddleware);

// Dispatch incoming HTTP request to specific operation
app.use(middlewareFactory.createDispatchMiddleware());

// TODO: AuthN middleware, like shared key auth or SAS auth

// Generated, will do basic validation defined in swagger
app.use(middlewareFactory.createDeserializerMiddleware());

// Generated, inject handlers to create a handler middleware
app.use(middlewareFactory.createHandlerMiddleware(handlers));

// Generated, will serialize response models into HTTP response
app.use(middlewareFactory.createSerializerMiddleware());

// Generated, will return HandlerError and Errors thrown in previous middleware/handlers to HTTP response
app.use(middlewareFactory.createErrorMiddleware());

// Generated, will end and return HTTP response immediately
app.use(middlewareFactory.createEndMiddleware());

export default app;
