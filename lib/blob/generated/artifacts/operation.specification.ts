// tslint:disable:object-literal-sort-keys
import * as msRest from "ms-rest-js";

import * as Mappers from "./mappers";
import Operation from "./Operation";
import * as Parameters from "./parameters";

const serializer = new msRest.Serializer(Mappers, true);

const listContainersSegmentOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  urlParameters: [Parameters.url],
  queryParameters: [
    Parameters.prefix,
    Parameters.marker,
    Parameters.maxresults,
    Parameters.include0,
    Parameters.timeout,
    Parameters.comp2,
  ],
  headerParameters: [Parameters.version, Parameters.requestId],
  responses: {
    200: {
      bodyMapper: Mappers.ListContainersSegmentResponse,
      headersMapper: Mappers.ServiceListContainersSegmentHeaders,
    },
    default: {
      bodyMapper: Mappers.StorageError,
    },
  },
  isXML: true,
  serializer,
};

const containerCreateOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{containerName}",
  urlParameters: [Parameters.url],
  queryParameters: [Parameters.timeout, Parameters.restype2],
  headerParameters: [
    Parameters.metadata,
    Parameters.access,
    Parameters.version,
    Parameters.requestId,
  ],
  responses: {
    201: {
      headersMapper: Mappers.ContainerCreateHeaders,
    },
    default: {
      bodyMapper: Mappers.StorageError,
    },
  },
  isXML: true,
  serializer,
};

// const commitBlockListOperationSpec: msRest.OperationSpec = {
//   httpMethod: "PUT",
//   path: "{containerName}/{blob}",
//   urlParameters: [Parameters.url],
//   queryParameters: [Parameters.timeout, Parameters.comp15],
//   headerParameters: [
//     Parameters.metadata,
//     Parameters.version,
//     Parameters.requestId,
//     Parameters.blobCacheControl,
//     Parameters.blobContentType,
//     Parameters.blobContentEncoding,
//     Parameters.blobContentLanguage,
//     Parameters.blobContentMD5,
//     Parameters.blobContentDisposition,
//     Parameters.leaseId0,
//     Parameters.ifModifiedSince,
//     Parameters.ifUnmodifiedSince,
//     Parameters.ifMatch,
//     Parameters.ifNoneMatch,
//   ],
//   requestBody: {
//     parameterPath: "blocks",
//     mapper: {
//       ...Mappers.BlockLookupList,
//       required: true,
//     },
//   },
//   contentType: "application/xml; charset=utf-8",
//   responses: {
//     201: {
//       headersMapper: Mappers.BlockBlobCommitBlockListHeaders,
//     },
//     default: {
//       bodyMapper: Mappers.StorageError,
//     },
//   },
//   isXML: true,
//   serializer,
// };

// const setPropertiesOperationSpec: msRest.OperationSpec = {
//   httpMethod: "PUT",
//   urlParameters: [Parameters.url],
//   queryParameters: [Parameters.timeout, Parameters.restype0, Parameters.comp0],
//   headerParameters: [Parameters.version, Parameters.requestId],
//   requestBody: {
//     parameterPath: "storageServiceProperties",
//     mapper: {
//       ...Mappers.StorageServiceProperties,
//       required: true,
//     },
//   },
//   contentType: "application/xml; charset=utf-8",
//   responses: {
//     202: {
//       headersMapper: Mappers.ServiceSetPropertiesHeaders,
//     },
//     default: {
//       bodyMapper: Mappers.StorageError,
//     },
//   },
//   isXML: true,
//   serializer,
// };

const Specifications: { [key: number]: msRest.OperationSpec } = {};
Specifications[Operation.Container_Create] = containerCreateOperationSpec;
Specifications[
  Operation.Service_ListContainersSegment
] = listContainersSegmentOperationSpec;

export default Specifications;
