import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
  data?: unknown[];
  success?: boolean;
  errors?: unknown[][];
}

const errorHandlerfn = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err instanceof ApiError ? err.statusCode : err.status || 500;
  const message = err.message.toLowerCase() || "An unexpected error occurred";
  const errors = err instanceof ApiError ? err.errors : [];

  res.status(status).json({
    status: "Fail",
    message: message,
    errors: errors,
  });
};

export default errorHandlerfn;
