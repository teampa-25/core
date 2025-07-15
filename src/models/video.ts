import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Sequelize,
} from "sequelize";

/**
 * Video Model Definition
 *
 * @exports Video - Sequelize video model
 */

export class Video extends Model<
  InferAttributes<Video>,
  InferCreationAttributes<Video>
> {
  declare id: string;
  declare dataset_id: ForeignKey<string>;
  declare file: string;
  declare name: string;
  declare frame_count: number;
  declare created_at: Date;
  declare updated_at: Date;

  static initModel(sequelize: Sequelize) {
    Video.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        dataset_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Dataset",
            key: "id",
          },
        },
        file: {
          type: DataTypes.STRING,
          allowNull: true,
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
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "Video",
        tableName: "Video",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    );
  }
}
