import { NextFunction, Request, Response } from "express";

import { getContextFromResponse } from "../IContext";
import * as Models from "../models";
import Operation from "../operation";

/**
 * serializerMiddleware
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export default function serializerMiddleware(
  // tslint:disable-next-line:variable-name
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const ctx = getContextFromResponse(res);

  if (ctx.operation === Operation.Service_ListContainersSegment) {
    // TODO: Serialize models
    const result: Models.IListContainersSegmentResponse = ctx.handlerResponses;
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <EnumerationResults ServiceEndpoint="${result.serviceEndpoint}">
      <Prefix>${result.prefix}</Prefix>
      <Marker>string-value</Marker>
      <MaxResults>${result.maxResults}</MaxResults>
      <Containers>
        <Container>
          <Name>container-name</Name>
          <Properties>
            <Last-Modified>date/time-value</Last-Modified>
            <Etag>etag</Etag>
            <LeaseStatus>locked | unlocked</LeaseStatus>
            <LeaseState>available | leased | expired | breaking | broken</LeaseState>
            <LeaseDuration>infinite | fixed</LeaseDuration>
            <PublicAccess>container | blob</PublicAccess>
            <HasImmutabilityPolicy>true | false</HasImmutabilityPolicy>
            <HasLegalHold>true | false</HasLegalHold>
          </Properties>
          <Metadata>
            <metadata-name>value</metadata-name>
          </Metadata>
        </Container>
      </Containers>
      <NextMarker>${result.nextMarker}</NextMarker>
    </EnumerationResults>`;

    // TODO: Retrive the status code
    res.contentType(`application/xml`);
    res.status(200);

    // TODO: If have body, need to send body in this stage, or hold the body to endMiddleware?
    res.send(xml);
  }

  next();
}
