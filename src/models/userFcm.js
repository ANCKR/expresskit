"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const auth_1 = __importDefault(require("./auth"));

class UserFcm extends sequelize_1.Model {}

UserFcm.init(
  {
    id: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: sequelize_1.DataTypes.UUID,
      allowNull: false,
      references: {
        model: auth_1.default,
        key: "unique_id_key",
      },
    },
    fcm_token: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    device_token: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: index_1.default,
    modelName: "userFcm",
  }
);

auth_1.default.hasMany(UserFcm, { foreignKey: "user_id" });
UserFcm.belongsTo(auth_1.default, { foreignKey: "unique_id_key" });

exports.default = UserFcm;
