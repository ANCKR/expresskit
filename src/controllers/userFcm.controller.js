"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserFcm = void 0;
const asyncHandeler_1 = __importDefault(require("../utils/asyncHandeler"));
const userFcm_1 = __importDefault(require("../models/userFcm"));
const ApiResponse_1 = require("../utils/ApiResponse");

exports.createUserFcm = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { fcmToken, deviceToken } = req.body;
    const uuid = req["user"].unique_id_key;

    const userFcm = yield userFcm_1.default.findOne({
      where: { user_id: uuid, device_token: deviceToken },
    });
    if (userFcm) {
      const status = yield userFcm_1.default.update(
        { status: 1 },
        { where: { user_id: uuid } }
      );
      console.log(status);
      return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "update successfully"));
    } else {
      const status = yield userFcm_1.default.create({
        user_id: uuid,
        fcm_token: fcmToken,
        device_token: deviceToken,
      });

      console.log(status);
      return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "create successfully"));
    }
  })
);
