import { Request, Response } from "express";

/**
 * End middleware is used to send out final HTTP response.
 * TODO: Move it to outside of generated scope code?
 *
 * @export
 * @param {Request} _req
 * @param {Response} res
 */
// tslint:disable-next-line:variable-name
export default function endMiddleware(_req: Request, res: Response): void {
  res.send();
}
