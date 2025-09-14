import { createNamespace, getNamespace } from "cls-hooked";
import { NextFunction, Request, Response } from "express";

const loggerNamespace = createNamespace("logger");
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = req?.get("X-Request-Id");
  res.set("X-Request-Id", reqId);
  const method = req?.method;
  const path = req?.originalUrl;
  const apiVersion = req?.originalUrl.split("/")[1];
  loggerNamespace.run(() => {
    loggerNamespace.set("requestId", reqId);
    loggerNamespace.set("reqMethod", method);
    loggerNamespace.set("reqPath", path);
    loggerNamespace.set("reqApiVersion", apiVersion);
    next();
  });
};  