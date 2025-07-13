import { Database } from "@/database/database";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey } from "sequelize";

const sequelize = Database.getInstance();

/**
 * Result Model Definition
 * 
 * @extends Result - Sequelize result model
*/

class Result extends Model<InferAttributes<Result>, InferCreationAttributes<Result>> {
  declare id: string;
  declare inference_job_id: ForeignKey<string>;
  declare json_res: object;
  declare image_zip: Buffer;
  declare created_at: Date;
  declare updated_at: Date;
}

Result.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    inference_job_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "InferenceJob",
        key: "id",
      },
    },
    json_res: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    image_zip: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Result",
    tableName: "Result",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export { Result };

