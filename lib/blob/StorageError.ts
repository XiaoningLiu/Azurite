import MiddlewareError from "./generated/errors/MiddlewareError";
import { jsonToXML } from "./generated/utils/xml";

export default class StorageError extends MiddlewareError {
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
      { "x-ms-error-code": storageErrorCode },
      bodyInXML,
      "application/xml"
    );

    this.name = "StorageServerError";
  }
}
