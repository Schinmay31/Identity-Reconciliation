import { NextFunction, Request, Response } from "express";


const REQUEST_LIMIT = 50;
const WINDOW_MS = 60 * 1000;
const COOLDOWN_MS = 30 * 1000;
const requestLimits = new Map();

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIP = req.ip;
  const route = req.path;
  const method = req.method;

  if (clientIP && route && method) {
    const key = `${clientIP}-${route}-${method}`;
    const currentTime = Date.now();
    const entry = requestLimits.get(key) || {
      count: 0,
      startTime: currentTime,
      nextWindowTime: currentTime + WINDOW_MS,
      cooldownTime: null,
    };

    if (entry.cooldownTime && currentTime < entry.cooldownTime) {
      const timeLeft = Math.ceil((entry.cooldownTime - currentTime) / 1000);
      const error = new Error(`Please try after ${timeLeft} seconds.`);
      return next(error);
    }

    if (currentTime - entry.startTime < WINDOW_MS) {
      if (entry.count >= REQUEST_LIMIT) {
        entry.cooldownTime = currentTime + COOLDOWN_MS;
        entry.count = 0;
        entry.startTime = entry.cooldownTime;
        requestLimits.set(key, entry);
        return next();
      } else {
        entry.count++;
      }
    } else {
      entry.count = 1;
      entry.startTime = currentTime;
      entry.nextWindowTime = currentTime + WINDOW_MS;
      entry.cooldownTime = null;
    }

    requestLimits.set(key, entry);
  }

  next();
};