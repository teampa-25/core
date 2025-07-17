import { Database } from "@/database/database";
import { User } from "./user";
import { Dataset } from "./dataset";
import { Video } from "./video";
import { InferenceJob } from "./inference.job";
import { Result } from "./result";
import { setupAssociations } from "./associations";

/**
 * Initializes the models and sets up their associations.
 * @param sequelize - The Sequelize instance to use for initializing the models.
 */

const sequelize = Database.getInstance();

User.initModel(sequelize);
Dataset.initModel(sequelize);
Video.initModel(sequelize);
InferenceJob.initModel(sequelize);
Result.initModel(sequelize);

setupAssociations();

export { User, Dataset, Video, InferenceJob, Result };
