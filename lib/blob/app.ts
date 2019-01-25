import express from "express";

import AppendBlobHandler from "./AppendBlobHandler";
import BlobHandler from "./BlobHandler";
import blobStorageContextMiddleware from "./blobStorageContext.middleware";
import BlockBlobHandler from "./BlockBlobHandler";
import { CONTEXT_PATH } from "./constants";
import ContainerHandler from "./ContainerHandler";
import ExpressMiddlewareFactory from "./generated/ExpressMiddlewareFactory";
import IHandlers from "./generated/handlers/IHandlers";
import MiddlewareFactory from "./generated/MiddlewareFactory";
import PageBlobHandler from "./PageBlobHandler";
import ServiceHandler from "./ServiceHandler";
import SimpleDataStore from "./SimpleDataStore";
import logger from "./utils/log/Logger";

const app = express();
app.disable("x-powered-by");

// MiddlewareFactory is a factory to create auto-generated middleware
const middlewareFactory: MiddlewareFactory = new ExpressMiddlewareFactory(
  logger,
  CONTEXT_PATH
);

// Data source is persistency layer entry
const dataSource = new SimpleDataStore();

// Create handlers into handler middleware factory
const handlers: IHandlers = {
  appendBlobHandler: new AppendBlobHandler(dataSource),
  blobHandler: new BlobHandler(dataSource),
  blockBlobHandler: new BlockBlobHandler(dataSource),
  containerHandler: new ContainerHandler(dataSource),
  pageBlobHandler: new PageBlobHandler(dataSource),
  serviceHandler: new ServiceHandler(dataSource),
};

/*
 * Generated middleware should follow strict orders
 * Manually created middleware can be injected into any points
 */

// Manually created middleware to deserialize feature related context which swagger doesn't know
app.use(blobStorageContextMiddleware);

// Dispatch incoming HTTP request to specific operation
// Emulator's URL pattern is like http://hostname:port/account/container
// Create a router to exclude account name from req.path, as url path in swagger doesn't include account
// Exclude account name from req.path for dispatchMiddleware
app.use(
  "/:account",
  express.Router().use(middlewareFactory.createDispatchMiddleware())
);

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
