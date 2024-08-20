import { Response } from "express";

interface SuccessResponse {
  message: string;
  data?: unknown;
  statusCode?: number;
}

export function createSuccessResponse(
  res: Response,
  data?: unknown,
  statusCode?: number,
) {
  if (typeof data === "string") {
    data = data.toLocaleLowerCase();
  }
  const response: SuccessResponse = { message: "SUCCESS", data };
  const statuscode = statusCode || 200;
  res.status(statuscode).json(response);
}
