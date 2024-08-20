import { DataTypes, Model } from "sequelize";
import sequelizeInstance from "./index";

class AppConfig extends Model {
  public id!: number;
  public app_version!: string;
  public new_changes!: string;
  public status!: "active" | "deprecate";
  public isCompulsory!: boolean;
}

AppConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    app_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    new_changes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isCompulsory: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "deprecate"),
      defaultValue: "active", // Set default as "active" or you can change it as needed
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "AppConfig",
    tableName: "app-configs",
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

export default AppConfig;
