import { computeHMACSHA256, truncatedISO8061Date } from "../utils/utils";
import { SASProtocol } from "./IAccountSASSignatureValues";
import { IIPRange, ipRangeToString } from "./IIPRange";

export enum BlobSASResourceType {
  Container = "c",
  Blob = "b"
}

/**
 * IBlobSASSignatureValues is used to help generating Blob service SAS tokens for containers or blobs.
 *
 * @export
 * @class IBlobSASSignatureValues
 */
export interface IBlobSASSignatureValues {
  /**
   * The version of the service this SAS will target. If not specified, it will default to the version targeted by the
   * library.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  version: string;

  /**
   * Optional. SAS protocols, HTTPS only or HTTPSandHTTP
   *
   * @type {SASProtocol | string}
   * @memberof IBlobSASSignatureValues
   */
  protocol?: SASProtocol | string;

  /**
   * Optional. When the SAS will take effect.
   *
   * @type {Date | string}
   * @memberof IBlobSASSignatureValues
   */
  startTime?: Date | string;

  /**
   * Optional only when identifier is provided. The time after which the SAS will no longer work.
   *
   * @type {Date | string}
   * @memberof IBlobSASSignatureValues
   */
  expiryTime?: Date | string;

  /**
   * Optional only when identifier is provided.
   * Please refer to either {@link ContainerSASPermissions} or {@link BlobSASPermissions} depending on the resource
   * being accessed for help constructing the permissions string.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  permissions?: string;

  /**
   * Optional. IP ranges allowed in this SAS.
   *
   * @type {IIPRange}
   * @memberof IBlobSASSignatureValues
   */
  ipRange?: IIPRange;

  /**
   * The name of the container the SAS user may access.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  containerName: string;

  /**
   * Optional. The name of the container the SAS user may access.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  blobName?: string;

  /**
   * Optional. The name of the access policy on the container this SAS references if any.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/establishing-a-stored-access-policy
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  identifier?: string;

  /**
   * Optional. The cache-control header for the SAS.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  cacheControl?: string;

  /**
   * Optional. The content-disposition header for the SAS.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  contentDisposition?: string;

  /**
   * Optional. The content-encoding header for the SAS.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  contentEncoding?: string;

  /**
   * Optional. The content-language header for the SAS.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  contentLanguage?: string;

  /**
   * Optional. The content-type header for the SAS.
   *
   * @type {string}
   * @memberof IBlobSASSignatureValues
   */
  contentType?: string;
}

/**
 * Creates an instance of SASQueryParameters.
 *
 * Only accepts required settings needed to create a SAS. For optional settings please
 * set corresponding properties directly, such as permissions, startTime and identifier.
 *
 * WARNING: When identifier is not provided, permissions and expiryTime are required.
 * You MUST assign value to identifier or expiryTime & permissions manually if you initial with
 * this constructor.
 *
 * @export
 * @param {IBlobSASSignatureValues} blobSASSignatureValues
 * @param {string} accountName
 * @param {Buffer} sharedKey
 * @returns {string}
 */
export function generateBlobSASSignature(
  blobSASSignatureValues: IBlobSASSignatureValues,
  accountName: string,
  sharedKey: Buffer
): string {
  if (
    !blobSASSignatureValues.identifier &&
    (!blobSASSignatureValues.permissions && !blobSASSignatureValues.expiryTime)
  ) {
    throw new RangeError(
      // tslint:disable-next-line:max-line-length
      "generateBlobSASSignature(): Must provide 'permissions' and 'expiryTime' for Blob SAS generation when 'identifier' is not provided."
    );
  }

  const version = blobSASSignatureValues.version;
  const verifiedPermissions = blobSASSignatureValues.permissions;

  // Signature is generated on the un-url-encoded values.
  const stringToSign = [
    verifiedPermissions ? verifiedPermissions : "",
    blobSASSignatureValues.startTime === undefined
      ? ""
      : typeof blobSASSignatureValues.startTime === "string"
      ? blobSASSignatureValues.startTime
      : truncatedISO8061Date(blobSASSignatureValues.startTime, false),
    blobSASSignatureValues.expiryTime === undefined
      ? ""
      : typeof blobSASSignatureValues.expiryTime === "string"
      ? blobSASSignatureValues.expiryTime
      : truncatedISO8061Date(blobSASSignatureValues.expiryTime, false),
    getCanonicalName(
      accountName,
      blobSASSignatureValues.containerName,
      blobSASSignatureValues.blobName
    ),
    blobSASSignatureValues.identifier, // TODO: ? blobSASSignatureValues.identifier : "",
    blobSASSignatureValues.ipRange
      ? ipRangeToString(blobSASSignatureValues.ipRange)
      : "",
    blobSASSignatureValues.protocol ? blobSASSignatureValues.protocol : "",
    version,
    blobSASSignatureValues.cacheControl
      ? blobSASSignatureValues.cacheControl
      : "",
    blobSASSignatureValues.contentDisposition
      ? blobSASSignatureValues.contentDisposition
      : "",
    blobSASSignatureValues.contentEncoding
      ? blobSASSignatureValues.contentEncoding
      : "",
    blobSASSignatureValues.contentLanguage
      ? blobSASSignatureValues.contentLanguage
      : "",
    blobSASSignatureValues.contentType ? blobSASSignatureValues.contentType : ""
  ].join("\n");

  const signature = computeHMACSHA256(stringToSign, sharedKey);
  return signature;
}

function getCanonicalName(
  accountName: string,
  containerName: string,
  blobName?: string
): string {
  // Container: "/blob/account/containerName"
  // Blob:      "/blob/account/containerName/blobName"
  const elements: string[] = [`/blob/${accountName}/${containerName}`];
  if (blobName) {
    elements.push(`/${blobName}`);
  }
  return elements.join("");
}