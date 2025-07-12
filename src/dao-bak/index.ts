export { BaseDAO } from "@/dao-bak/interfaces/base.dao";
export { SequelizeBaseDAO } from "@/dao/base/squelize.base.dao";

// DAO impls
export { UserDAO, UserCreateAttributes, UserUpdateAttributes } from "./user";
export {
  DatasetDAO,
  DatasetCreateAttributes,
  DatasetUpdateAttributes,
} from "./dataset";
export {
  VideoDAO,
  VideoCreateAttributes,
  VideoUpdateAttributes,
} from "./video";
export {
  InferenceJobDAO,
  InferenceJobCreateAttributes,
  InferenceJobUpdateAttributes,
} from "./inference.job";
export {
  ResultDAO,
  ResultCreateAttributes,
  ResultUpdateAttributes,
} from "./result";
export { TagDAO, TagCreateAttributes, TagUpdateAttributes } from "./tag";

import { UserDAO } from "./user";
import { DatasetDAO } from "./dataset";
import { VideoDAO } from "./video";
import { InferenceJobDAO } from "./inference.job";
import { ResultDAO } from "./result";
import { TagDAO } from "./tag";

/**
 *  DAO Factory
 */
export class DAOFactory {
  static createUserDAO(): UserDAO {
    return new UserDAO();
  }

  static createDatasetDAO(): DatasetDAO {
    return new DatasetDAO();
  }

  static createVideoDAO(): VideoDAO {
    return new VideoDAO();
  }

  static createInferenceJobDAO(): InferenceJobDAO {
    return new InferenceJobDAO();
  }

  static createResultDAO(): ResultDAO {
    return new ResultDAO();
  }

  static createTagDAO(): TagDAO {
    return new TagDAO();
  }
}
