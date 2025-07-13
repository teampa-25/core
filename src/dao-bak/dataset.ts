import { Dataset } from "@/models/dataset";
import { SequelizeBaseDAO } from "@/dao/base/squelize.base.dao";
import { Op, InferAttributes, InferCreationAttributes } from "sequelize";

// helpers for better type safety and consistency
export type DatasetCreateAttributes = InferCreationAttributes<Dataset>;
export type DatasetUpdateAttributes = Partial<InferAttributes<Dataset>>;

/**
 * Dataset DAO class for database operations
 * Extends the base DAO with Dataset-specific methods
 */
export class DatasetDAO extends SequelizeBaseDAO<
  Dataset,
  DatasetCreateAttributes,
  DatasetUpdateAttributes
> {
  constructor() {
    super(Dataset);
  }

  /**
   * Find datasets by user ID (excluding soft deleted)
   * @param userId - The user ID to search for
   * @returns Promise of array of datasets
   */
  async findByUserId(userId: string): Promise<Dataset[]> {
    try {
      return (await this.model.findAll({
        where: {
          user_id: userId,
          deleted_at: null,
        },
      })) as Dataset[];
    } catch (error) {
      throw new Error(`Error finding datasets for user ${userId}: ${error}`);
    }
  }

  /**
   * Find datasets by tags (excluding soft deleted)
   * @param tags - Array of tags to search for
   * @returns Promise of array of datasets
   */
  async findByTags(tags: string[]): Promise<Dataset[]> {
    try {
      return (await this.model.findAll({
        where: {
          tags: {
            [Op.overlap]: tags,
          },
          deleted_at: null,
        },
      })) as Dataset[];
    } catch (error) {
      throw new Error(`Error finding datasets by tags: ${error}`);
    }
  }

  /**
   * Find dataset by user and name (excluding soft deleted)
   * @param userId - The user ID
   * @param name - The dataset name
   * @returns Promise of the dataset or null if not found
   */
  async findByUserAndName(
    userId: string,
    name: string,
  ): Promise<Dataset | null> {
    try {
      return (await this.model.findOne({
        where: {
          user_id: userId,
          name,
          deleted_at: null,
        },
      })) as Dataset | null;
    } catch (error) {
      throw new Error(
        `Error finding dataset by user ${userId} and name ${name}: ${error}`,
      );
    }
  }

  /**
   * Soft delete a dataset
   * @param id - The dataset ID to soft delete
   * @returns Promise of boolean indicating success
   */
  async softDelete(id: string): Promise<boolean> {
    try {
      const [updatedRowsCount] = await this.model.update(
        { deleted_at: new Date() },
        {
          where: { id },
        },
      );
      return updatedRowsCount > 0;
    } catch (error) {
      throw new Error(`Error soft deleting dataset ${id}: ${error}`);
    }
  }

  /**
   * Restore a soft deleted dataset
   * @param id - The dataset ID to restore
   * @returns Promise of boolean indicating success
   */
  async restore(id: string): Promise<boolean> {
    try {
      const [updatedRowsCount] = await this.model.update(
        { deleted_at: null },
        {
          where: { id },
        },
      );
      return updatedRowsCount > 0;
    } catch (error) {
      throw new Error(`Error restoring dataset ${id}: ${error}`);
    }
  }

  /**
   * Find all datasets including soft deleted
   * @param options - Optional query options
   * @returns Promise of array of datasets
   */
  async findAllIncludingDeleted(options: any = {}): Promise<Dataset[]> {
    try {
      return (await this.model.findAll({
        ...options,
        paranoid: false,
      })) as Dataset[];
    } catch (error) {
      throw new Error(`Error finding all datasets including deleted: ${error}`);
    }
  }

  /**
   * Find datasets by user with tag filtering
   * @param userId - The user ID
   * @param tags - Optional array of tags to filter by
   * @returns Promise of array of datasets
   */
  async findByUserWithTags(
    userId: string,
    tags?: string[],
  ): Promise<Dataset[]> {
    try {
      const whereClause: any = {
        user_id: userId,
        deleted_at: null,
      };

      if (tags && tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: tags,
        };
      }

      return (await this.model.findAll({
        where: whereClause,
      })) as Dataset[];
    } catch (error) {
      throw new Error(`Error finding datasets by user with tags: ${error}`);
    }
  }

  /**
   * Update dataset tags
   * @param id - Dataset ID
   * @param tags - New tags array
   * @returns Promise of the updated dataset or null if not found
   */
  async updateTags(id: string, tags: string[]): Promise<Dataset | null> {
    try {
      return await this.update(id, { tags });
    } catch (error) {
      throw new Error(`Error updating tags for dataset ${id}: ${error}`);
    }
  }

  /**
   * Check if dataset name exists for user (excluding soft deleted)
   * @param userId - The user ID
   * @param name - The dataset name
   * @param excludeId - Optional ID to exclude from check (for updates)
   * @returns Promise of boolean indicating if name exists
   */
  async nameExistsForUser(
    userId: string,
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    try {
      const whereClause: any = {
        user_id: userId,
        name,
        deleted_at: null,
      };

      if (excludeId) {
        whereClause.id = {
          [Op.ne]: excludeId,
        };
      }

      const count = await this.model.count({
        where: whereClause,
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Error checking if dataset name exists: ${error}`);
    }
  }
}
