// Base interfaces and classes
export { BaseDAO } from "./interfaces/BaseDAO";
export { SequelizeBaseDAO } from "./base/SequelizeBaseDAO";

// DAO impls
export { UserDAO, UserCreateAttributes, UserUpdateAttributes } from "./UserDAO";
export {
  DatasetDAO,
  DatasetCreateAttributes,
  DatasetUpdateAttributes,
} from "./DatasetDAO";
export {
  VideoDAO,
  VideoCreateAttributes,
  VideoUpdateAttributes,
} from "./VideoDAO";
export {
  InferenceJobDAO,
  InferenceJobCreateAttributes,
  InferenceJobUpdateAttributes,
} from "./InferenceJobDAO";
export {
  ResultDAO,
  ResultCreateAttributes,
  ResultUpdateAttributes,
} from "./ResultDAO";
export { TagDAO, TagCreateAttributes, TagUpdateAttributes } from "./TagDAO";

// DAOs import
import { UserDAO } from "./UserDAO";
import { DatasetDAO } from "./DatasetDAO";
import { VideoDAO } from "./VideoDAO";
import { InferenceJobDAO } from "./InferenceJobDAO";
import { ResultDAO } from "./ResultDAO";
import { TagDAO } from "./TagDAO";

// DAO Factory that creates DAO's instances
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
