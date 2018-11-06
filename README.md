# Azurite New Architecture

## Description

## Features

* Auto generated protocol layer, models, serializer, deserializer and handler interfaces
* Flexible structure to customize manually middlewares and generated middlewares
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