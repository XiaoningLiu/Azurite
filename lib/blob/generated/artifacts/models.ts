// tslint:disable:max-line-length
// Models will host all auto generated models

export interface IServiceSetPropertiesOptionalParams {
  timeoutParameter?: number;
  requestId?: string;
}

export interface IStorageServiceProperties {
  logging?: Logging;
  hourMetrics?: Metrics;
  minuteMetrics?: Metrics;
  cors?: CorsRule[];
  defaultServiceVersion?: string;
  deleteRetentionPolicy?: RetentionPolicy;
  staticWebsite?: StaticWebsite;
}

export interface Logging {
  version: string;
  deleteProperty: boolean;
  read: boolean;
  write: boolean;
  retentionPolicy: RetentionPolicy;
}

export interface RetentionPolicy {
  enabled: boolean;
  days?: number;
}

export interface Metrics {
  version?: string;
  enabled: boolean;
  includeAPIs?: boolean;
  retentionPolicy?: RetentionPolicy;
}

export interface CorsRule {
  allowedOrigins: string;
  allowedMethods: string;
  allowedHeaders: string;
  exposedHeaders: string;
  maxAgeInSeconds: number;
}

export interface StaticWebsite {
  enabled: boolean;
  indexDocument?: string;
  errorDocument404Path?: string;
}

export type ServiceSetPropertiesResponse_201 = IServiceSetPropertiesHeaders & {
  statusCode: 201;
};
export interface IServiceSetPropertiesHeaders {
  requestId?: string;
  version?: string;
  errorCode?: string;
}

export enum ListContainersIncludeType {
  Metadata = "metadata",
}

export interface IServiceListContainersSegmentOptionalParams {
  prefix?: string;
  marker?: string;
  maxresults?: number;
  include?: ListContainersIncludeType;
  timeout?: number;
  requestId?: string;
}

export interface IContainerItem {
  name: string;
  properties: IContainerProperties;
  metadata?: { [propertyName: string]: string };
}

export enum LeaseStatusType {
  Locked = "locked",
  Unlocked = "unlocked",
}

export enum LeaseDurationType {
  Infinite = "infinite",
  Fixed = "fixed",
}

export enum LeaseStateType {
  Available = "available",
  Leased = "leased",
  Expired = "expired",
  Breaking = "breaking",
  Broken = "broken",
}

export enum PublicAccessType {
  Container = "container",
  Blob = "blob",
}

export interface IContainerProperties {
  lastModified: Date;
  etag: string;
  leaseStatus?: LeaseStatusType;
  leaseState?: LeaseStateType;
  leaseDuration?: LeaseDurationType;
  publicAccess?: PublicAccessType;
  hasImmutabilityPolicy?: boolean;
  hasLegalHold?: boolean;
}

export interface IListContainersSegmentResponse {
  serviceEndpoint: string;
  prefix: string;
  marker?: string;
  maxResults: number;
  containerItems?: IContainerItem[];
  nextMarker: string;
}

export interface IServiceListContainersSegmentHeaders {
  requestId?: string;
  version?: string;
  errorCode?: string;
}

export type IServiceListContainersSegmentResponse_200 = IListContainersSegmentResponse &
  IServiceListContainersSegmentHeaders & { statusCode: 200 };

export interface IContainerCreateOptionalParams {
  timeout?: number;
  metadata?: { [propertyName: string]: string };
  access?: PublicAccessType;
  requestId?: string;
}

export type IContainerCreateResponse_201 = IContainerCreateHeaders & { statusCode: 201 };

export interface IContainerCreateHeaders {
  eTag?: string;
  lastModified?: Date;
  requestId?: string;
  version?: string;
  date?: Date;
  errorCode?: string;
}
