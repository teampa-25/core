/**
 * Database model associations
 * This file sets up all relationships between models
 * It should be imported after all models have been initialized
 */

import { Result } from "./result";
import { Dataset } from "./dataset";
import { InferenceJob } from "./inference.job";
import { User } from "./user";
import { Video } from "./video";

export function setupAssociations() {
  // User associations
  User.hasMany(Dataset, { foreignKey: "user_id", as: "datasets" });
  User.hasMany(InferenceJob, { foreignKey: "user_id", as: "inferenceJobs" });

  // Dataset associations
  Dataset.belongsTo(User, { foreignKey: "user_id", as: "user" });
  Dataset.hasMany(Video, { foreignKey: "dataset_id", as: "videos" });
  Dataset.hasMany(InferenceJob, {
    foreignKey: "dataset_id",
    as: "inferenceJobs",
  });

  // Video associations
  Video.belongsTo(Dataset, { foreignKey: "dataset_id", as: "dataset" });
  Video.hasMany(InferenceJob, { foreignKey: "video_id", as: "inferenceJobs" });

  // InferenceJob associations
  InferenceJob.belongsTo(Dataset, { foreignKey: "dataset_id", as: "dataset" });
  InferenceJob.belongsTo(User, { foreignKey: "user_id", as: "user" });
  InferenceJob.belongsTo(Video, { foreignKey: "video_id", as: "video" });
  InferenceJob.hasOne(Result, { foreignKey: "inferenceJob_id", as: "result" });

  // Result associations
  Result.belongsTo(InferenceJob, {
    foreignKey: "inferenceJob_id",
    as: "inferenceJob",
  });
}
