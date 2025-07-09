import {
  Model,
  DataTypes,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../../config/sequelize";

/**
 * Interface Result defines the structure of a Result object in the database.
 */
export class Result extends Model<
  InferAttributes<Result>,
  InferCreationAttributes<Result>
> {
  declare id: CreationOptional<string>;
  declare inferenceJob_id: ForeignKey<string>;
  declare json_res: object;
  declare image_zip: Buffer;
  declare created_at: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Result.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    inferenceJob_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "InferenceJobs",
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
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Result",
    tableName: "Results",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updatedAt",
  },
);

export default Result;
