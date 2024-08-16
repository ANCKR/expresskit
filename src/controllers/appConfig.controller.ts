import { Request, Response } from "express";
import asyncHandeler from "../utils/asyncHandeler";
import { ApiResponse } from "../utils/ApiResponse";
import AppConfig from "../models/app-config";
import { createCustomError } from "../utils/customError";

export const showAppVersion = asyncHandeler(
  async (req: Request, res: Response) => {
    const version = await AppConfig.findOne({
      attributes: ["status", "app_version", "new_changes", "isCompulsory"],
      order: [["createdAt", "desc"]],
    });

    if (!version) {
      return res.status(404).json(new ApiResponse(404, "No version found"));
    }

    return res.status(200).json(new ApiResponse(200, "Version found", version));
  }
);

export const appVersionInsert = asyncHandeler(
  async (req: Request, res: Response) => {
    const { version, details, isCompulsory } = req.body;
    if (!isCompulsory) {
      const newVersion = await AppConfig.create({
        app_version: version,
        new_changes: details,
        isCompulsory: 0,
      });
      return res.status(200).json(new ApiResponse(200, "New version uploaded"));
    }
    if (isCompulsory) {
      const existingVersion = await AppConfig.findOne({
        where: {
          status: "active",
        },
      });

      if (!existingVersion) {
        const newVersion = await AppConfig.create({
          app_version: version,
          new_changes: details,
          isCompulsory: 1,
        });
        return res
          .status(200)
          .json(new ApiResponse(200, "New version uploaded"));
      }

      const updateExistingVersion = await AppConfig.update(
        {
          status: "deprecate",
        },
        { where: { status: "active" } }
      );

      if (!updateExistingVersion) {
        throw createCustomError("Error occurs", 400);
      }

      const newVersion = await AppConfig.create({
        app_version: version,
        new_changes: details,
        isCompulsory: 1,
      });
      return res.status(200).json(new ApiResponse(200, "New version uploaded"));
    }
  }
);
