import MiddlewareError from "./generated/errors/MiddlewareError";
import { jsonToXML } from "./generated/utils/xml";

/**
 * Represents an Azure Storage Server Error.
 *
 * @export
 * @class StorageError
 * @extends {MiddlewareError}
 */
export default class StorageError extends MiddlewareError {
  /**
   * Creates an instance of StorageError.
   *
   * @param {number} statusCode HTTP response status code
   * @param {string} storageErrorCode Azure Storage error code, will be in response body and header
   * @param {string} storageErrorMessage Azure Storage error message
   * @param {string} storageRequestID Azure Storage server request ID
   * @param {{ [key: string]: string }} [storageAdditionalErrorMessages={}]
   *                                  Additional error messages will be included in XML body
   * @memberof StorageError
   */
  constructor(
    statusCode: number,
    storageErrorCode: string,
    storageErrorMessage: string,
    storageRequestID: string,
    storageAdditionalErrorMessages: { [key: string]: string } = {}
  ) {
    const bodyInJSON: any = {
      Code: storageErrorCode,
      Message: `${storageErrorMessage} RequestId:${storageRequestID} Time:${new Date().toISOString()}`,
    };

    for (const key in storageAdditionalErrorMessages) {
      if (storageAdditionalErrorMessages.hasOwnProperty(key)) {
        const element = storageAdditionalErrorMessages[key];
        bodyInJSON[key] = element;
      }
    }

    const bodyInXML = `<?xml version="1.0" encoding="utf-8"?><Error>${jsonToXML(
      bodyInJSON
    ) as string}</Error>`;

    super(
      statusCode,
      storageErrorMessage,
      undefined,
      { "x-ms-error-code": storageErrorCode, "x-ms-request-id": storageRequestID },
      bodyInXML,
      "application/xml"
    );

    this.name = "StorageError";
  }
}
