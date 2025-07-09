import { Dataset } from "../../database/models/Dataset";
import {
  DatasetCreateAttributes,
  DatasetUpdateAttributes,
} from "../../dao/DatasetDAO";
import { IBaseRepository } from "./IBaseRepository";

/**
 * Dataset repository interface defining Dataset-specific operations
 */
export interface IDatasetRepository
  extends IBaseRepository<
    Dataset,
    DatasetCreateAttributes,
    DatasetUpdateAttributes
  > {
  /**
   * Find datasets by user ID (excluding soft deleted)
   */
  findByUserId(userId: string): Promise<Dataset[]>;

  /**
   * Find datasets by tags (excluding soft deleted)
   */
  findByTags(tags: string[]): Promise<Dataset[]>;

  /**
   * Find dataset by user and name (excluding soft deleted)
   */
  findByUserAndName(userId: string, name: string): Promise<Dataset | null>;

  /**
   * Soft delete a dataset
   */
  softDelete(id: string): Promise<boolean>;

  /**
   * Restore a soft deleted dataset
   */
  restore(id: string): Promise<boolean>;

  /**
   * Find all datasets including soft deleted
   */
  findAllIncludingDeleted(options?: any): Promise<Dataset[]>;

  /**
   * Find datasets by user with optional tag filtering
   */
  findByUserWithTags(userId: string, tags?: string[]): Promise<Dataset[]>;

  /**
   * Update dataset tags
   */
  updateTags(id: string, tags: string[]): Promise<Dataset | null>;

  /**
   * Check if dataset name exists for user (excluding soft deleted)
   */
  nameExistsForUser(
    userId: string,
    name: string,
    excludeId?: string,
  ): Promise<boolean>;
}
