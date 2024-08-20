import { DataTypes, Model } from "sequelize";
import sequelizeInstance from "./index";
import Auth from "./auth";

class UserFcm extends Model {
  public id!: string;
  public user_id!: string;
  public fcm_token!: string;
  public device_token!: string;
  public status!: number;
}

UserFcm.init(
  {
    id: { type: DataTypes.STRING, allowNull: false },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Auth,
        key: "unique_id_key",
      },
    },
    fcm_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "userFcm",
  }
);
Auth.hasMany(UserFcm, { foreignKey: "user_id" });
UserFcm.belongsTo(Auth, { foreignKey: "unique_id_key" });
export default UserFcm;
