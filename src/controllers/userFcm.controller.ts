import asyncHandeler from "utils/asyncHandeler";
import { Request, Response } from "express";
import UserFcm from "models/userFcm";
import { ApiResponse } from "utils/ApiResponse";

export const createUserFcm = asyncHandeler(
  async (req: Request, res: Response) => {
    const { fcmToken, deviceToken } = req.body;
    const uuid = req["user"].unique_id_key;

    const userFcm = await UserFcm.findOne({
      where: { user_id: uuid, device_token: deviceToken },
    });
    if (userFcm) {
      const status = await UserFcm.update(
        { status: 1 },
        { where: { user_id: uuid } },
      );
      return res.status(200).json(new ApiResponse(200, "update successfully"));
    } else {
      const status = await UserFcm.create({
        user_id: uuid,
        fcm_token: fcmToken,
        device_token: deviceToken,
      });
      return res.status(200).json(new ApiResponse(200, "create successfully"));
    }
  },
);
