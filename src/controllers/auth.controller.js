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
exports.refreshAccessToken =
  exports.signout =
  exports.getAllUserData =
  exports.resetPassword =
  exports.forgotPassword =
  exports.signIn =
  exports.signUp =
  exports.generateAccessAndRefereshTokens =
    void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const validation_1 = __importDefault(require("../helper/validation"));
const auth_1 = __importDefault(require("../models/auth"));
const asyncHandeler_1 = __importDefault(require("../utils/asyncHandeler"));
const customError_1 = require("../utils/customError");
const jwt_1 = require("../utils/jwt");
const ApiResponse_1 = require("../utils/ApiResponse");
const logger_1 = __importDefault(require("../utils/logger"));
const user_1 = __importDefault(require("../models/user"));
const events_1 = require("events");
const transport_1 = __importDefault(require("../helper/transport"));
const staticConfig_1 = __importDefault(require("../helper/staticConfig"));
const sendMail_1 = require("../helper/sendMail");
const options = {
  httpOnly: true,
  secure: true,
};
const generateAccessAndRefereshTokens = (username, unique_id_key) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const accessToken = yield (0, jwt_1.generateAccessToken)({
        username,
        unique_id_key,
      });
      const refreshToken = yield (0, jwt_1.generateRefreshToken)({
        username,
        unique_id_key,
      });
      yield auth_1.default.update(
        { refreshToken: refreshToken },
        { where: { unique_id_key: unique_id_key } }
      );
      return { accessToken, refreshToken };
    } catch (error) {
      logger_1.default.error(error);
      throw (0,
      customError_1.createCustomError)("Something went wrong while generating referesh and access token", 500);
    }
  });
exports.generateAccessAndRefereshTokens = generateAccessAndRefereshTokens;
exports.signUp = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const usernameCheck = (0, validation_1.default)(username, "emailcheck");
    if (!usernameCheck) {
      throw (0, customError_1.createCustomError)("invalid emailId", 401);
    }
    const passwordCheck = (0, validation_1.default)(password, "passwordcheck");
    if (!passwordCheck) {
      throw (0, customError_1.createCustomError)("invalid password", 401);
    }
    const existedUser = yield auth_1.default.findOne({ where: { username } });
    if (existedUser) {
      throw (0, customError_1.createCustomError)("user already exists", 401);
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const uniqueIdKey = (0, uuid_1.v4)();
    const user = yield auth_1.default.create({
      username: username,
      password: hashedPassword,
      unique_id_key: uniqueIdKey,
    });
    const { accessToken, refreshToken } = yield (0,
    exports.generateAccessAndRefereshTokens)(
      username,
      user === null || user === void 0 ? void 0 : user.dataValues.unique_id_key
    );
    let eventEmitter = new events_1.EventEmitter();
    eventEmitter.on("emailSent", (data) => {
      (0, transport_1.default)(data);
    });
    // Emit the 'emailSent' event with the necessary data
    eventEmitter.emit("emailSent", {
      senderEmail: username,
      subject: staticConfig_1.default.signUpEmail.subject,
      text: staticConfig_1.default.signUpEmail.text,
    });
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse_1.ApiResponse(200, "Sign-up Successfully", {
          accessToken,
          refreshToken: refreshToken,
        })
      );
  })
);
exports.signIn = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield auth_1.default.findOne({ where: { username } });
    if (
      !user ||
      !(yield bcrypt_1.default.compare(
        password,
        user === null || user === void 0 ? void 0 : user.dataValues.password
      ))
    ) {
      throw (0, customError_1.createCustomError)(
        "Invalid username or password",
        401
      );
    }
    const { accessToken, refreshToken } = yield (0,
    exports.generateAccessAndRefereshTokens)(
      username,
      user === null || user === void 0 ? void 0 : user.dataValues.unique_id_key
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse_1.ApiResponse(200, "Sign in Successfully", {
          accessToken,
          refreshToken: refreshToken,
        })
      );
  })
);
exports.forgotPassword = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const device = req.header("Device");
    const { username, baseUrl } = req.body;
    let url = baseUrl;
    const user = yield auth_1.default.findOne({ where: { username } });
    if (!user) {
      throw (0, customError_1.createCustomError)("Invalid username", 401);
    }
    let eventEmitter = new events_1.EventEmitter();
    eventEmitter.on("emailSent", (data) => {
      (0, transport_1.default)(data);
    });

    if (device === "Mobile") {
      let query = `${user.dataValues.unique_id_key}/`;

      // Locate the position to insert the query parameter
      let insertPosition = url.indexOf("#Intent");

      // Insert the query parameter before "#Intent"
      let newUrl =
        url.slice(0, insertPosition) + query + url.slice(insertPosition);
      url = newUrl;
    } else {
      url = url + `/?uuid=${user.dataValues.unique_id_key}`;
    }

    // Emit the 'emailSent' event with the necessary data
    eventEmitter.emit("emailSent", {
      senderEmail: username,
      subject: staticConfig_1.default.forgotPasswordEmail.subject,
      text: ``,
      htmlTemplate: (0, sendMail_1.resetPasswordTemplate)(url),
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, `${url}`));
  })
);
exports.resetPassword = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { uuid, password } = req.body;
    const passwordCheck = (0, validation_1.default)(password, "passwordcheck");
    if (!passwordCheck) {
      throw (0, customError_1.createCustomError)("Invalid password", 401);
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const [user] = yield auth_1.default.update(
      { password: hashedPassword },
      { where: { unique_id_key: uuid } }
    );
    if (!user) {
      throw (0, customError_1.createCustomError)("Invalid uuid", 401);
    }
    return res
      .status(200)
      .json(
        new ApiResponse_1.ApiResponse(200, "Reset Data Successfully", user)
      );
  })
);
exports.getAllUserData = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_1.default.findAll({
      attributes: [],
      include: {
        model: user_1.default,
        as: "user",
        required: true, // Ensures that only records with matching users are fetched
      },
      raw: true,
    });
    return res
      .status(200)
      .json(
        new ApiResponse_1.ApiResponse(
          200,
          "User data retrieved Successfully",
          users
        )
      );
  })
);
exports.signout = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token", { httpOnly: true, secure: true });
    return res
      .status(200)
      .json(new ApiResponse_1.ApiResponse(200, "Logged out successfully"));
  })
);
exports.refreshAccessToken = (0, asyncHandeler_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = req.checkResult;
    const { accessToken, refreshToken } = yield (0,
    exports.generateAccessAndRefereshTokens)(user.username, user.unique_id_key);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse_1.ApiResponse(200, "Access token refreshed", {
          accessToken,
          refreshToken: refreshToken,
        })
      );
  })
);
