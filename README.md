# Azurite New Architecture

## Description

## Features

* Auto generated protocol layer, models, serializer, deserializer and handler interfaces
* Flexible structure to customize manually middleware and generated middleware
* ES6 native promise and async methods, less dependencies
* Create different handlers by implementing generated handler interface

## Run it

```bash
npm install
npm run build
node dist/blob/blob.server.js
```

### List containers

GET http://localhost:10000/account?comp=list

### Create container

PUT http://localhost:10000/account/containerName?restype=container

Notice: `x-ms-version` is a required header.

## TODO

Following items need to be done for Azurite new architecture:

1. Feature implementation to 2018-03-28
  * Key features for Service/Container/BlockBlobs
  * Other features
  * Lease
  * SharedKey Auth
  * OAuth
  * SAS
2. Testing
3. Parameters configuration align with legacy Azurite
4. Logging align with legacy Azurite

Following items needs to be done on generator:

1. Clean up unused code in generator itself
2. Drop @azure/ms-rest-js dependency