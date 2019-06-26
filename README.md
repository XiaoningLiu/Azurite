# Azurite V3

[![npm version](https://badge.fury.io/js/azurite.svg)](https://badge.fury.io/js/azurite)
[![Build Status](https://dev.azure.com/azure/Azurite/_apis/build/status/Azure.Azurite?branchName=master)](https://dev.azure.com/azure/Azurite/_build/latest?definitionId=20&branchName=master)

> Note:
> Azurite V2 has been moved to [legacy-master](https://github.com/Azure/azurite/tree/legacy-master) branch.
> Master branch has been updated with latest Azurite V3.
> V3 currently only supports Blob service, please use V2 for Queue or Table service for the time being.

| Version       | Azure Storage API Version | Service Support       | Description                                       | Reference Links                                                                                                                                                                                                         |
| ------------- | ------------------------- | --------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1.2-preview | 2018-03-28                | Blob                  | Azurite V3 based on TypeScript & New Architecture | [NPM](https://www.npmjs.com/package/azurite) - [Docker](https://hub.docker.com/_/microsoft-azure-storage-azurite) - [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite) |
| 2.7.0         | 2016-05-31                | Blob, Queue and Table | Legacy Azurite V2                                 | [NPM](https://www.npmjs.com/package/azurite)                                                                                                                                                                            |

## Introduction

Azurite is an open source Azure Storage API compatible server (emulator). Based on Node.js, Azurite provides cross platform experiences for customers wanting to try Azure Storage easily in a local environment. Azurite simulates most of the commands supported by Azure Storage with minimal dependencies.

Azurite V2 is manually created with pure JavaScript, popular and active as an open source project. However, Azure Storage APIs are growing and keeping updating, manually keeping Azurite up to date is not efficient and prone to bugs. JavaScript also lacks strong type validation which prevents easy collaboration.

Compared to V2, Azurite V3 implements a new architecture leveraging code generated by a TypeScript Server Code Generator we created. The generator uses the same swagger (modified) used by the new Azure Storage SDKs. This reduces manual effort and more facilitates better code alignment with storage APIs.

3.0.0-preview is the first release version using Azurite's new architecture.

## Features & Key Changes in Azurite V3

- Blob storage features align with Azure Storage API version 2018-03-28 (Refer to support matrix section below)
  - SharedKey/Account SAS/Service SAS/Public Access Authentications
  - Get/Set Blob Service Properties
  - Create/List/Delete Containers
  - Create/Read/List/Update/Delete Block Blobs
  - Create/Read/List/Update/Delete Page Blobs
- Features **NEW** on V3
  - Built with TypeScript and ECMA native promise and async features
  - New architecture based on TypeScript server generator. Leverage auto generated protocol layer, models, serializer, deserializer and handler interfaces from REST API swagger
  - Flexible structure and architecture, supports customizing handler layer implementation, persistency layer implementation, HTTP pipeline middleware injection
  - Detailed debugging log support, easy bug locating and reporting
  - Works with storage .Net SDK basic and advanced sample
  - SharedKey, AccountSAS, ServiceSAS, Public Access authentication support
  - API version targeting 2018-03-28 (Refer to support matrix)

## Getting Started

Try with any of following ways to start an Azurite V3 instance.

### GitHub

After cloning source code, execute following commands to install and start Azurite V3.

```bash
npm install
npm run build
npm install -g
azurite
```

### NPM

In order to run Azurite V3 you need Node.js >= 8.0 installed on your system. Azurite works cross-platform on Windows, Linux, and OS X.

After installation you can install Azurite simply with npm which is the Node.js package management tool included with every Node.js installation.

```cmd
npm install -g azurite
```

Simply start it with the following command:

```cmd
azurite -s -l c:\azurite -d c:\azurite\debug.log
```

or,

```cmd
azurite --silent --location c:\azurite --debug c:\azurite\debug.log
```

This tells Azurite to store all data in a particular directory `c:\azurite`. If the `-l` option is omitted it will use the current working directory. You can also selectively start different storage services.

For example, to start blob service only:

```bash
$ azurite-blob -l path/to/azurite/workspace
```

### Visual Studio Code Extension

Azurite V3 can be installed from [Visual Studio Code extension market](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite).

You can quickly start or close Azurite by clicking Azurite **status bar item** or following commands.

Extension supports following Visual Studio Code commands:

- `Azurite: Start` Start all Azurite services
- `Azurite: Close` Close all Azurite services
- `Azurite: Clean` Reset all Azurite services persistency data
- `Azurite: Start Blob` Start blob service
- `Azurite: Close Blob` Close blob service
- `Azurite: Clean Blob` Clean blob service

Following extension configurations are supported:

- `azurite.blobHost` Blob service listening endpoint, by default 127.0.0.1
- `azurite.blobPort` Blob service listening port, by default 10000
- `azurite.location` Workspace location path, by default existing Visual Studio Code opened folder
- `azurite.silent` Silent mode to disable access log in Visual Studio channel, by default false
- `azurite.debug` Output debug log into Azurite channel, by default false

### [DockerHub](https://hub.docker.com/_/microsoft-azure-storage-azurite)

#### Run Azurite V3 docker image

```bash
docker run -p 10000:10000 mcr.microsoft.com/azure-storage/azurite
```

`-p 10000:10000` will expose blob service's default listening port.

#### Run Azurite V3 docker image with customized persisted data location

```bash
docker run -p 10000:10000 -v c:/azurite:/data mcr.microsoft.com/azure-storage/azurite
```

`-v c:/azurite:/data` will use and map host path `c:/azurite` as Azurite's workspace location.

#### Customize all Azurite V3 supported parameters for docker image

```bash
docker run -p 8888:8888 -v c:/azurite:/workspace mcr.microsoft.com/azure-storage/azurite azurite -l /workspace -d /workspace/debug.log --blobPort 8888 --blobHost 0.0.0.0
```

Above command will try to start Azurite image with configurations:

`-l //workspace` defines folder `/workspace` as Azurite's location path inside docker instance, while `/workspace` is mapped to `c:/azurite` in host environment by `-v c:/azurite:/workspace`

`-d //workspace/debug.log` enables debug log into `/workspace/debug.log` inside docker instance. `debug.log` will also mapped to `c:/azurite/debug.log` in host machine because of docker volume mapping.

`--blobPort 8888` makes Azurite blob service listen to port 8888, while `-p 8888:8888` redirects requests from host machine's port 8888 to docker instance.

`--blobHost 0.0.0.0` defines blob service listening endpoint to accept requests from host machine.

> In above sample, you need to use **double first forward slash** for location and debug path parameters to avoid a [known issue](https://stackoverflow.com/questions/48427366/docker-build-command-add-c-program-files-git-to-the-path-passed-as-build-argu) for Git on Windows.

> Will support more release channels for Azurite V3 in the future.

### NuGet

_Releasing Azurite V3 to NuGet is under investigation._

### Visual Studio

_Integrate Azurite with Visual Studio is under investigation._

## Supported Command Line Options

### Listening Host Configuration

Optional. By default, Azurite V3 will listen to 127.0.0.1 as a local server.
You can customize the listening address per your requirements.

#### Only Accept Requests in Local Machine

```cmd
--blobHost 127.0.0.1
```

#### Allow Accepting Requests from Remote (potentially unsafe)

```cmd
--blobHost 0.0.0.0
```

### Listening Port Configuration

Optional. By default, Azurite V3 will listen to 10000 as blob service port.
You can customize the listening port per your requirements.

> Warning: After using a customized port, you need to update connection string or configurations correspondingly in your Storage Tools or SDKs.

#### Customize Blob Service Listening Port

```cmd
--blobPort 8888
```

#### Let System Auto Select an Available Port

```cmd
--blobPort 0
```

> Note: The port in use is displayed on Azurite startup.

### Workspace Path Configuration

Optional. Azurite V3 needs to persist metadata and binary data to local disk during execution.

You can provide a customized path as the workspace location, or by default, Current process working directory will be used.

```cmd
-l c:\azurite
--location c:\azurite
```

###

### Access Log Configuration

Optional. By default Azurite will display access log in console. **Disable** it by:

```cmd
-s
--silent
```

### Debug Log Configuration

Optional. Debug log includes detailed information on every request and exception stack traces.  
Enable it by providing a valid local file path for the debug log destination.

```
-d path/debug.log
--debug path/debug.log
```

### Command Line Options Differences between Azurite V2

Azurite V3 supports SharedKey, Account Shared Access Signature (SAS), Service SAS and Public Container Access authentications, you can use any Azure Storage SDKs or tools like Storage Explorer to connect Azurite V3 with any authentication strategy.

An option to bypass authentication is **NOT** provided in Azurite V3.

## Usage with Azure Storage SDKs or Tools

### Default Storage Account

Azurite V3 provides support for a default storage account as General Storage Account V2 and associated features.

- Account name: `devstoreaccount1`
- Account key: `Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==`

> Note. Besides SharedKey authentication, Azurite V3 supports account and service SAS authentication. Anonymous access is also available when container is set to allow public access.

### Connection String

Typically you can pass following connection strings to SDKs or tools (like Azure CLI2.0 or Storage Explorer)

Take blob service as example, full connection string is:

```
DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
```

Or if the SDK or tools support following short connection string:

```
UseDevelopmentStorage=true;
```

### Storage Explorer

Connect to Azurite by click "Add Account" icon, then select "Attach to a local emulator" and click "Connect".

## Differences between Azurite and Azure Storage

Because Azurite runs as a local instance for persistent data storage, there are differences in functionality between Azurite and an Azure storage account in the cloud.

### Storage Accounts

> Please reach to us or open issues if you need multi storage account support.

Azurite V3 supports a default account as General Storage Account V2 and provides features.

- Account name: `devstoreaccount1`
- Account key: `Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==`

### Endpoint & Connection URL

The service endpoints for Azurite are different from those of an Azure storage account. The difference is because the local computer does not perform domain name resolution, requiring Azurite endpoints to be local addresses.

When you address a resource in an Azure storage account, use the following scheme. The account name is part of the URI host name, and the resource being addressed is part of the URI path:

```
<http|https>://<account-name>.<service-name>.core.windows.net/<resource-path>
```

For example, the following URI is a valid address for a blob in an Azure storage account:

```
https://myaccount.blob.core.windows.net/mycontainer/myblob.txt
```

However, because the local computer does not perform domain name resolution, the account name is part of the URI path instead of the host name. Use the following URI format for a resource in Azurite:

```
http://<local-machine-address>:<port>/<account-name>/<resource-path>
```

For example, the following address might be used for accessing a blob in Azurite:

```
http://127.0.0.1:10000/myaccount/mycontainer/myblob.txt
```

The service endpoints for Azurite blob service:

```
http://127.0.0.1:10000/<account-name>/<resource-path>
```

### Scalability & Performance

> Please reach to us if you have requirements or suggestions for a distributed Azurite implementation or higher performance.

Azurite is not a scalable storage service and does not support many concurrent clients. There is also no performance and TPS guarantee, they highly depend on the environments Azurite has deployed.

### Error Handling

> Please reach to us if you have requirements or suggestions for a specific error handling.

Azurite tries to align with Azure Storage error handling logic, and provides best-efforts alignment based on Azure Storage online documentation. But CANNOT provide 100% alignment, such as error messages (returned in error response body) maybe different (while error status code will align).

### API Version Compatible Strategy

Azurite V3 follows a **Try best to serve** compatible strategy with Azure Storage API versions:

- An Azurite V3 instance has a baseline Azure Storage API version.
  - A Swagger definition (OpenAPI doc) with the same API version will be used to generate protocol layer APIs and interfaces.
  - Azurite should implement all the possible features provided in this API service version.
- If an incoming request has **the same API version** Azurite provides, Azurite should handle the request with parity to Azure Storage.
- If an incoming request has a **higher API version** than Azurite, Azurite will return a VersionNotSupportedByEmulator error (HTTP status code 400 - Bad Request).
- If an incoming request has a **lower API version** header than Azurite, Azurite will attempt to handle the request with Azurite’s baseline API version behavior instead of that specified in the request.
- Azurite will return API version in response header as the baseline API version
- SAS accepts pattern from API version 2015-04-05

### RA-GRS

Azurite supports read-access geo-redundant replication (RA-GRS). For storage resources both in the cloud and in the local emulator, you can access the secondary location by appending -secondary to the account name. For example, the following address might be used for accessing a blob using the read-only secondary in Azurite:

```
http://127.0.0.1:10000/devstoreaccount1-secondary/mycontainer/myblob.txt
```

## Differences between Azurite V3 and Azurite V2

Both Azurite V3 and Azurite V2 aim to provide a convenient emulation for customers to quickly try out Azure Storage services locally. There are lots of differences between Azurite V3 and legacy Azurite V2.

### Architecture

Architecture in Azurite V3 has been refactored, it's more flexible and robust. It provides the flexibility to support following scenarios in the future:

- Use other HTTP frameworks instead of express.js
- Customized new handler layer implementation, such as redirecting requests to Azure Storage services
- Implement and inject a new persistency layer implementation, such as one based on a different database service
- Provide support for multiple azure storage accounts and authentication
- Detailed debug logging for easy issue investigation and request tracking
- Create HTTPS server
- ...

### Server Code Generator

Azurite V3 leverages a TypeScript server code generator based on Azure Storage REST API swagger specifications. This reduces manual efforts and ensures alignment with the API implementation.

### TypeScript

Azurite V3 selected TypeScript as its' programming language, as this facilitates broad collaboration, whilst also ensuring quality.

### Features Scope

Legacy Azurite V2 supports Azure Storage Blob, Queue and Table services.  
Azurite V3 currently only supports Azure Storage blob service, with queue support to follow soon.  
Table service support is currently under discussion.

Azurite V3 supports features from Azure Storage API version 2018-03-28, and will maintain parity with the latest API versions, in a more frequent update frequency than legacy Azurite V2.

## TypeScript Server Code Generator

Azurite V3 leverages a TypeScript Node.js Server Code Generator to generate the majority of code from Azure Storage REST APIs swagger specification.  
Currently, the generator project is private, under development and only used by Azurite V3.
We have plans to make the TypeScript server generator public after Azurite V3 releases.  
All the generated code is kept in `generated` folder, including the generated middleware, request and response models.

## Support Matrix

3.0.0-preview release targets **2018-03-28** API version **blob** service.  
Detailed support matrix:

- Supported Vertical Features
  - SharedKey Authentication
  - Shared Access Signature Account Level
  - Shared Access Signature Service Level (Not support response header override in service SAS)
  - Container Public Access
- Supported REST APIs
  - List Containers
  - Set Service Properties
  - Get Service Properties
  - Get Stats
  - Get Account Information
  - Create Container
  - Get Container Properties
  - Get Container Metadata
  - Set Container Metadata
  - Get Container ACL
  - Set Container ACL
  - Delete Container
  - Lease Container (Access control based on lease is partial support)
  - List Blobs
  - Put Blob (Create append blob is not supported)
  - Get Blob
  - Get Blob Properties
  - Set Blob Properties
  - Get Blob Metadata
  - Set Blob Metadata
  - Lease Blob (access control based on lease is partial support)
  - Snapshot Blob
  - Copy Blob (Only supports copy within same account in Azurite)
  - Abort Copy Blob (Only supports copy within same account in Azurite)
- Following features or REST APIs are NOT supported or limited supported in this release (will support more features per customers feedback in future releases)
  - OAuth authentication
  - Access control based on conditional headers, container/blob lease (lease control is limited supported)
  - CORS and Preflight
  - Static Website
  - Soft delete & Undelete Blob
  - Put Block from URL
  - Incremental Copy Blob
  - Create Append Blob, Append Block

## License

This project is licensed under MIT.

## We Welcome Contributions!

> Go to [GitHub project](https://github.com/Azure/Azurite/projects) page or [GitHub issues](https://github.com/Azure/Azurite/issues) for the milestone and TODO items we are used for tracking upcoming features and bug fixes.

We are currently working on Azurite V3 to implement the remaining Azure Storage REST APIs.  
We finished the basic structure and majority of features in Blob Storage, as can be seen in the support matrix.  
The detailed work items are also tracked in GitHub repository projects and issues.

Any contribution and suggestions for Azurite V3 is welcome, please goto `CONTRIBUTION.md` for detailed contribution guidelines. Alternatively, you can open GitHub issues voting for any missing features in Azurite V3.

Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.microsoft.com.>

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
