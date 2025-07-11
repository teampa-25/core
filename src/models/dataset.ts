import {  Database  } from "@/database/database";
import {  DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, ForeignKey } from "sequelize";
import { User } from "@/models/user";

const sequelize = Database.getInstance();

/**
 * Dataset Model Definition
 * 
 * @extends Dataset - Sequelize dataset model
*/

class Dataset extends Model<InferAttributes<Dataset>, InferCreationAttributes<Dataset>> {
  declare id: string;
  declare user_id: ForeignKey<string>;
  declare name: string;
  declare tags: string[];
  declare deleted_at: CreationOptional<Date | null>;
  declare created_at: Date;
  declare updated_at: Date;
}

Dataset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    deleted_at: {
      type: DataTypes.DATE,
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
    modelName: "Dataset",
    tableName: "Dataset",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "unique_user_dataset_name",
        unique: true,
        fields: ["user_id", "name"],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);

export { Dataset };

