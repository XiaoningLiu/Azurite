import express from "express";

import blobStorageContextMiddleware from "./context/blobStorageContext.middleware";
import ExpressMiddlewareFactory from "./generated/ExpressMiddlewareFactory";
import IHandlers from "./generated/handlers/IHandlers";
import MiddlewareFactory from "./generated/MiddlewareFactory";
import AppendBlobHandler from "./handlers/AppendBlobHandler";
import BlobHandler from "./handlers/BlobHandler";
import BlockBlobHandler from "./handlers/BlockBlobHandler";
import ContainerHandler from "./handlers/ContainerHandler";
import PageBlobHandler from "./handlers/PageBlobHandler";
import ServiceHandler from "./handlers/ServiceHandler";
import IBlobDataStore from "./persistence/IBlobDataStore";
import LokiBlobDataStore from "./persistence/LokiBlobDataStore";
import { CONTEXT_PATH, LOKI_DB_PATH } from "./utils/constants";
import logger from "./utils/log/Logger";

const app = express().disable("x-powered-by");

// MiddlewareFactory is a factory to create auto-generated middleware
const middlewareFactory: MiddlewareFactory = new ExpressMiddlewareFactory(
  logger,
  CONTEXT_PATH
);

// Data source is persistency layer entry
const dataSource: IBlobDataStore = new LokiBlobDataStore(LOKI_DB_PATH);

// TODO: This is a potential async call, considering handling it with await or then
// For Loki based implementation, it's not async actually, leave it here
dataSource.init();

// Create handlers into handler middleware factory
const handlers: IHandlers = {
  appendBlobHandler: new AppendBlobHandler(dataSource, logger),
  blobHandler: new BlobHandler(dataSource, logger),
  blockBlobHandler: new BlockBlobHandler(dataSource, logger),
  containerHandler: new ContainerHandler(dataSource, logger),
  pageBlobHandler: new PageBlobHandler(dataSource, logger),
  serviceHandler: new ServiceHandler(dataSource, logger),
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
