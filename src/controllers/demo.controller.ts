import { Request, Response } from "express";
import asyncHandeler from "../utils/asyncHandeler";
import { createSuccessResponse } from "../utils/createSuccessResponse";

export const demo = asyncHandeler(async (req: Request, res: Response) => {
  const data = "abcasde";
  return createSuccessResponse(res, data);
});
