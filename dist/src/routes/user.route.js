"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authTokenCheck_1 = __importDefault(
  require("../middleware/authTokenCheck"),
);
const user_controller_1 = require("../controllers/user.controller");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).single("file");
router.put(
  "/profile-detail/:id",
  authTokenCheck_1.default,
  user_controller_1.updateUserDetails,
);
router.delete(
  "/profile-delete/:id",
  authTokenCheck_1.default,
  user_controller_1.deleteUserDetails,
);
router.get(
  "/profile-details",
  authTokenCheck_1.default,
  user_controller_1.profileDetails,
);
router.get(
  "/profile-detail/:id",
  authTokenCheck_1.default,
  user_controller_1.profileDetailsByUserId,
);
router.post(
  "/uploadFile",
  authTokenCheck_1.default,
  upload,
  user_controller_1.uploadFile,
);
router.get(
  "/downloadFile",
  authTokenCheck_1.default,
  user_controller_1.downloadFile,
);
router.post(
  "/userNotification",
  authTokenCheck_1.default,
  user_controller_1.userNotification,
);
router.post(
  "/uploadFileBase64",
  authTokenCheck_1.default,
  user_controller_1.uploadImageBase64,
);
exports.default = router;
