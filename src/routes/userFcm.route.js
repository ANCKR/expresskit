"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authTokenCheck_1 = __importDefault(
  require("../middleware/authTokenCheck")
);
const userController_1 = __importDefault(
  require("../controllers/userFcm.controller")
);
const router = (0, express_1.Router)();

// router.post(
//   "/userFcm",
//   authTokenCheck_1.default,
//   userFcm_controller_1.createUserFcm
// );

exports.default = router;
