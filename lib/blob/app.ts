import express from "express";

import blobStorageContextMiddleware from "./blobStorageContext.middleware";
import { CONTEXT_PATH } from "./constants";
import ExpressMiddlewareFactory from "./generated/ExpressMiddlewareFactory";
import SimpleContainerHandler from "./SimpleContainerHandler";
import SimpleDataStore from "./SimpleDataStore";
import SimpleServiceHandler from "./SimpleServiceHandler";
import logger from "./utils/log/Logger";

const app = express();
app.disable("x-powered-by");

// MiddlewareFactory is a factory to create auto-generated middleware
const middlewareFactory = new ExpressMiddlewareFactory(logger, CONTEXT_PATH);

// Data source is persistency layer entry
const dataSource = new SimpleDataStore();

// Create handlers into handler middleware factory
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

// Generated, will return MiddlewareError and Errors thrown in previous middleware/handlers to HTTP response
app.use(middlewareFactory.createErrorMiddleware());

// Generated, will end and return HTTP response immediately
app.use(middlewareFactory.createEndMiddleware());

export default app;
