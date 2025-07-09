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
 * Interface Video defines the structure of a Video object in the database.
 */
export class Video extends Model<
  InferAttributes<Video>,
  InferCreationAttributes<Video>
> {
  declare id: CreationOptional<string>;
  declare dataset_id: ForeignKey<string>;
  declare file: Buffer;
  declare name: string;
  declare frame_count: number;
  declare created_at: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Video.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    dataset_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Datasets",
        key: "id",
      },
    },
    file: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frame_count: {
      type: DataTypes.INTEGER,
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
    modelName: "Video",
    tableName: "Videos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updatedAt",
  },
);

export default Video;
