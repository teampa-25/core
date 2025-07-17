import { CNSResponse } from "@/common/types";
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Sequelize,
  CreationOptional,
} from "sequelize";

/**
 * Result Model Definition
 *
 * @extends Result - Sequelize result model
 */

export class Result extends Model<
  InferAttributes<Result>,
  InferCreationAttributes<Result>
> {
  declare id: CreationOptional<string>;
  declare inferenceJob_id: ForeignKey<string>;
  declare json_res: CNSResponse;
  declare image_zip: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize) {
    Result.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        inferenceJob_id: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
          references: {
            model: "InferenceJob",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        json_res: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        image_zip: {
          type: DataTypes.STRING,
          allowNull: true,
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
  }
}
