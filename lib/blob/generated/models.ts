// tslint:disable:max-line-length
// Models will host all auto generated models

/**
 * Defines values for ListContainersIncludeType.
 * Possible values include: 'metadata'
 * @readonly
 * @enum {string}
 */
export enum ListContainersIncludeType {
  Metadata = "metadata",
}

/**
 * @interface
 * An interface representing ServiceListContainersSegmentOptionalParams.
 * Optional Parameters.
 *
 * @extends RequestOptionsBase
 */
export interface IServiceListContainersSegmentOptionalParams {
  /**
   * @member {string} [prefix] Filters the results to return only containers
   * whose name begins with the specified prefix.
   */
  prefix?: string;
  /**
   * @member {string} [marker] A string value that identifies the portion of
   * the list of containers to be returned with the next listing operation. The
   * operation returns the NextMarker value within the response body if the
   * listing operation did not return all containers remaining to be listed
   * with the current page. The NextMarker value can be used as the value for
   * the marker parameter in a subsequent call to request the next page of list
   * items. The marker value is opaque to the client.
   */
  marker?: string;
  /**
   * @member {number} [maxresults] Specifies the maximum number of containers
   * to return. If the request does not specify maxresults, or specifies a
   * value greater than 5000, the server will return up to 5000 items. Note
   * that if the listing operation crosses a partition boundary, then the
   * service will return a continuation token for retrieving the remainder of
   * the results. For this reason, it is possible that the service will return
   * fewer results than specified by maxresults, or than the default of 5000.
   */
  maxresults?: number;
  /**
   * @member {ListContainersIncludeType} [include] Include this parameter to
   * specify that the container's metadata be returned as part of the response
   * body. Possible values include: 'metadata'
   */
  include?: ListContainersIncludeType;
  /**
   * @member {number} [timeout] The timeout parameter is expressed in seconds.
   * For more information, see <a
   * href="https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/setting-timeouts-for-blob-service-operations">Setting
   * Timeouts for Blob Service Operations.</a>
   */
  timeout?: number;
  /**
   * @member {string} [requestId] Provides a client-generated, opaque value
   * with a 1 KB character limit that is recorded in the analytics logs when
   * storage analytics logging is enabled.
   */
  requestId?: string;
}

/**
 * @interface
 * An interface representing ContainerItem.
 * An Azure Storage container
 *
 */
export interface IContainerItem {
  /**
   * @member {string} name
   */
  name: string;
  /**
   * @member {ContainerProperties} properties
   */
  properties: IContainerProperties;
  /**
   * @member {{ [propertyName: string]: string }} [metadata]
   */
  metadata?: { [propertyName: string]: string };
}

/**
 * Defines values for LeaseStatusType.
 * Possible values include: 'locked', 'unlocked'
 * @readonly
 * @enum {string}
 */
export enum LeaseStatusType {
  Locked = "locked",
  Unlocked = "unlocked",
}

/**
 * Defines values for LeaseDurationType.
 * Possible values include: 'infinite', 'fixed'
 * @readonly
 * @enum {string}
 */
export enum LeaseDurationType {
  Infinite = "infinite",
  Fixed = "fixed",
}

/**
 * Defines values for LeaseStateType.
 * Possible values include: 'available', 'leased', 'expired', 'breaking',
 * 'broken'
 * @readonly
 * @enum {string}
 */
export enum LeaseStateType {
  Available = "available",
  Leased = "leased",
  Expired = "expired",
  Breaking = "breaking",
  Broken = "broken",
}

/**
 * Defines values for PublicAccessType.
 * Possible values include: 'container', 'blob'
 * There could be more values for this enum apart from the ones defined here.If
 * you want to set a value that is not from the known values then you can do
 * the following:
 * let param: PublicAccessType =
 * <PublicAccessType>"someUnknownValueThatWillStillBeValid";
 * @readonly
 * @enum {string}
 */
export enum PublicAccessType {
  Container = "container",
  Blob = "blob",
}

/**
 * @interface
 * An interface representing ContainerProperties.
 * Properties of a container
 *
 */
export interface IContainerProperties {
  /**
   * @member {Date} lastModified
   */
  lastModified: Date;
  /**
   * @member {string} etag
   */
  etag: string;
  /**
   * @member {LeaseStatusType} [leaseStatus] Possible values include: 'locked',
   * 'unlocked'
   */
  leaseStatus?: LeaseStatusType;
  /**
   * @member {LeaseStateType} [leaseState] Possible values include:
   * 'available', 'leased', 'expired', 'breaking', 'broken'
   */
  leaseState?: LeaseStateType;
  /**
   * @member {LeaseDurationType} [leaseDuration] Possible values include:
   * 'infinite', 'fixed'
   */
  leaseDuration?: LeaseDurationType;
  /**
   * @member {PublicAccessType} [publicAccess] Possible values include:
   * 'container', 'blob'
   */
  publicAccess?: PublicAccessType;
  /**
   * @member {boolean} [hasImmutabilityPolicy]
   */
  hasImmutabilityPolicy?: boolean;
  /**
   * @member {boolean} [hasLegalHold]
   */
  hasLegalHold?: boolean;
}

/**
 * @interface
 * An interface representing ListContainersSegmentResponse.
 * An enumeration of containers
 *
 */
export interface IListContainersSegmentResponse {
  /**
   * @member {string} serviceEndpoint
   */
  serviceEndpoint: string;
  /**
   * @member {string} prefix
   */
  prefix: string;
  /**
   * @member {string} [marker]
   */
  marker?: string;
  /**
   * @member {number} maxResults
   */
  maxResults: number;
  /**
   * @member {ContainerItem[]} [containerItems]
   */
  containerItems?: IContainerItem[];
  /**
   * @member {string} nextMarker
   */
  nextMarker: string;
}

/**
 * @interface
 * An interface representing ServiceListContainersSegmentHeaders.
 * Defines headers for ListContainersSegment operation.
 *
 */
export interface IServiceListContainersSegmentHeaders {
  /**
   * @member {string} [requestId] This header uniquely identifies the request
   * that was made and can be used for troubleshooting the request.
   */
  requestId?: string;
  /**
   * @member {string} [version] Indicates the version of the Blob service used
   * to execute the request. This header is returned for requests made against
   * version 2009-09-19 and above.
   */
  version?: string;
  /**
   * @member {string} [errorCode]
   */
  errorCode?: string;
}

/**
 * Contains response data for the listContainersSegment operation.
 */
export type IServiceListContainersSegmentResponse = IListContainersSegmentResponse &
  IServiceListContainersSegmentHeaders;
