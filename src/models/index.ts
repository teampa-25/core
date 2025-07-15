import { Database } from "@/database/database";
import { User } from "./user";
import { Dataset } from "./dataset";
import { Video } from "./video";
import { InferenceJob } from "./inference.job";
import { Result } from "./result";
import { setupAssociations } from "./associations";

const sequelize = Database.getInstance();

User.initModel(sequelize);
Dataset.initModel(sequelize);
Video.initModel(sequelize);
InferenceJob.initModel(sequelize);
Result.initModel(sequelize);

setupAssociations(); // relazioni

export { User, Dataset, Video, InferenceJob, Result };
