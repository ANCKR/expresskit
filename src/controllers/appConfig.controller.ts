import { Request, Response } from "express";
import asyncHandeler from "../utils/asyncHandeler";
import { ApiResponse } from "../utils/ApiResponse";
import AppConfig from "../models/app-config";
import { createCustomError } from "../utils/customError";

export const showAppVersion = asyncHandeler(
  async (req: Request, res: Response) => {
    const { current_version } = await req.body;
    const currentVersionStatus = await AppConfig.findOne({
      attributes: ["status"],
      where: {
        app_version: current_version,
      },
    });
    if (currentVersionStatus.dataValues.status === "deprecate") {
      const newVersion = await AppConfig.findOne({
        where: { status: "active" },
        order: [["createdAt", "DESC"]],
      });

      if (!newVersion) {
        throw createCustomError("No version found", 404);
      }

      let versionLog = {
        app_version: current_version,
        status: currentVersionStatus.dataValues.status,
        newVersion: newVersion.dataValues,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, "New version found", versionLog));
    } else {
      const newVersionLog = await AppConfig.findAll({
        where: { status: "active" },
        order: [["createdAt", "DESC"]],
      });
      if (newVersionLog.length === 1) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              "New Version found",
              newVersionLog[0].dataValues
            )
          );
      }
    }
  }
);

export const appVersionInsert = asyncHandeler(
  async (req: Request, res: Response) => {
    const { version, details, isCompulsory } = req.body;
    if (!isCompulsory) {
      const newVersion = await AppConfig.create({
        app_version: version,
        new_changes: details,
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
        throw createCustomError("Active Version not found", 404);
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
      });
      return res.status(200).json(new ApiResponse(200, "New version uploaded"));
    }
  }
);
