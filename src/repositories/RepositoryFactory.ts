import { DAOFactory } from "../dao";
import { DatasetRepository } from "./DatasetRepository";
import { UserRepository } from "./UserRepository";
import { VideoRepository } from "./VideoRepository";
import { InferenceJobRepository } from "./InferenceJobRepository";
import { ResultRepository } from "./ResultRepository";
import { TagRepository } from "./TagRepository";
import { IDatasetRepository } from "./interfaces/IDatasetRepository";
import { IUserRepository } from "./interfaces/IUserRepository";
import { IVideoRepository } from "./interfaces/IVideoRepository";
import { IInferenceJobRepository } from "./interfaces/IInferenceJobRepository";
import { IResultRepository } from "./interfaces/IResultRepository";
import { ITagRepository } from "./interfaces/ITagRepository";

/**
 * Repository Factory
 * Creates repository instances with their respective DAO dependencies
 */
export class RepositoryFactory {
  /**
   * Create a new DatasetRepository instance
   */
  static createDatasetRepository(): IDatasetRepository {
    const datasetDAO = DAOFactory.createDatasetDAO();
    return new DatasetRepository(datasetDAO);
  }

  /**
   * Create a new UserRepository instance
   */
  static createUserRepository(): IUserRepository {
    const userDAO = DAOFactory.createUserDAO();
    return new UserRepository(userDAO);
  }

  /**
   * Create a new VideoRepository instance
   */
  static createVideoRepository(): IVideoRepository {
    const videoDAO = DAOFactory.createVideoDAO();
    return new VideoRepository(videoDAO);
  }

  /**
   * Create a new InferenceJobRepository instance
   */
  static createInferenceJobRepository(): IInferenceJobRepository {
    const inferenceJobDAO = DAOFactory.createInferenceJobDAO();
    return new InferenceJobRepository(inferenceJobDAO);
  }

  /**
   * Create a new ResultRepository instance
   */
  static createResultRepository(): IResultRepository {
    const resultDAO = DAOFactory.createResultDAO();
    return new ResultRepository(resultDAO);
  }

  /**
   * Create a new TagRepository instance
   */
  static createTagRepository(): ITagRepository {
    const tagDAO = DAOFactory.createTagDAO();
    return new TagRepository(tagDAO);
  }
}
