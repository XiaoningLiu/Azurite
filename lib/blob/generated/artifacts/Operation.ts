/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

export enum Operation {
  Service_SetProperties,
  Service_GetProperties,
  Service_GetStatistics,
  Service_ListContainersSegment,
  Service_GetAccountInfo,
  Container_Create,
  Container_GetProperties,
  Container_GetPropertiesWithHead,
  Container_Delete,
  Container_SetMetadata,
  Container_GetAccessPolicy,
  Container_SetAccessPolicy,
  Container_AcquireLease,
  Container_ReleaseLease,
  Container_RenewLease,
  Container_BreakLease,
  Container_ChangeLease,
  Container_ListBlobFlatSegment,
  Container_ListBlobHierarchySegment,
  Container_GetAccountInfo,
  Blob_Download,
  Blob_GetProperties,
  Blob_Delete,
  Blob_Undelete,
  Blob_SetHTTPHeaders,
  Blob_SetMetadata,
  Blob_AcquireLease,
  Blob_ReleaseLease,
  Blob_RenewLease,
  Blob_ChangeLease,
  Blob_BreakLease,
  Blob_CreateSnapshot,
  Blob_StartCopyFromURL,
  Blob_AbortCopyFromURL,
  Blob_SetTier,
  Blob_GetAccountInfo,
  PageBlob_Create,
  PageBlob_UploadPages,
  PageBlob_ClearPages,
  PageBlob_GetPageRanges,
  PageBlob_GetPageRangesDiff,
  PageBlob_Resize,
  PageBlob_UpdateSequenceNumber,
  PageBlob_CopyIncremental,
  AppendBlob_Create,
  AppendBlob_AppendBlock,
  BlockBlob_Upload,
  BlockBlob_StageBlock,
  BlockBlob_StageBlockFromURL,
  BlockBlob_CommitBlockList,
  BlockBlob_GetBlockList,
}
export default Operation;
