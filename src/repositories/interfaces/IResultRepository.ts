import { Result } from "../../database/models";
import {
  ResultCreateAttributes,
  ResultUpdateAttributes,
} from "../../dao/ResultDAO";
import { IBaseRepository } from "./IBaseRepository";

/**
 * Result repository interface defining Result-specific operations
 */
export interface IResultRepository
  extends IBaseRepository<
    Result,
    ResultCreateAttributes,
    ResultUpdateAttributes
  > {
  /**
   * Find result by inference job ID
   */
  findByInferenceJobId(inferenceJobId: string): Promise<Result | null>;

  /**
   * Update JSON result
   */
  updateJsonResult(id: string, jsonRes: object): Promise<Result | null>;

  /**
   * Update image ZIP
   */
  updateImageZip(id: string, imageZip: Buffer): Promise<Result | null>;

  /**
   * Find results by user (through inference job relationship)
   */
  findByUserId(userId: string): Promise<Result[]>;

  /**
   * Find results by dataset (through inference job relationship)
   */
  findByDatasetId(datasetId: string): Promise<Result[]>;

  /**
   * Get result storage size
   */
  getStorageSize(id: string): Promise<number>;

  /**
   * Get total storage size for user results
   */
  getTotalStorageSizeForUser(userId: string): Promise<number>;

  /**
   * Delete result by inference job ID
   */
  deleteByInferenceJobId(inferenceJobId: string): Promise<boolean>;

  /**
   * Check if result exists for inference job
   */
  existsForInferenceJob(inferenceJobId: string): Promise<boolean>;

  /**
   * Get results count for user
   */
  getResultsCountForUser(userId: string): Promise<number>;

  /**
   * Find results by date range
   */
  findResultsByDateRange(startDate: Date, endDate: Date): Promise<Result[]>;
}
