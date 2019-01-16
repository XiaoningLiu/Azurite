import * as xml from "fast-xml-parser";

import HandlerError from "./generated/errors/HandlerError";

const parser = new xml.j2xParser({});

export default class StorageServerError extends HandlerError {
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

    const bodyInXML = `<?xml version="1.0" encoding="utf-8"?><Error>${parser.parse(bodyInJSON) as string}</Error>`;

    super(statusCode, storageErrorMessage, undefined, { "x-ms-error-code": storageErrorCode }, bodyInXML);

    this.name = "StorageServerError";
  }
}
