import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { InferenceJobStatus } from "./enums/inference.job.status";

/**
 * InferenceJob Model Definition
 *
 * @extends InferenceJob - Sequelize inferenceJob model
 */

export class InferenceJob extends Model<
  InferAttributes<InferenceJob>,
  InferCreationAttributes<InferenceJob>
> {
  declare id: string;
  declare dataset_id: ForeignKey<string>;
  declare user_id: ForeignKey<string>;
  declare video_id: ForeignKey<string>;
  declare status: InferenceJobStatus;
  declare params: object;
  declare carbon_footprint: number;
  declare created_at: Date;
  declare updated_at: Date;

  static initModel(sequelize: Sequelize) {
    InferenceJob.init(
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
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "User",
            key: "id",
          },
        },
        video_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Video",
            key: "id",
          },
        },
        status: {
          type: DataTypes.ENUM(...Object.values(InferenceJobStatus)),
          allowNull: false,
          defaultValue: InferenceJobStatus.PENDING,
        },
        params: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        carbon_footprint: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
        modelName: "InferenceJob",
        tableName: "InferenceJob",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    );
  }
}
