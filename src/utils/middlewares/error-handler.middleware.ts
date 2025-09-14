// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";

interface CustomError extends Error {
  statusCode?: number;
}

export const  errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
)  => {
  console.error(err); // log for debugging

  // Sequelize validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors.map(e => e.message),
    });
  }

  // Sequelize unique constraint errors
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      error: "Duplicate Entry",
      details: err.errors.map(e => e.message),
    });
  }

  // Custom errors with status code
  if ("statusCode" in err && err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Fallback for unknown errors
  res.status(500).json({ error: "Internal Server Error" });
}
