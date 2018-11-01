import express, { Request, Response } from "express";

const endMiddleware: express.RequestHandler = (
  _req: Request,
  res: Response
): any => {
  res.send(200);
};

export default endMiddleware;
