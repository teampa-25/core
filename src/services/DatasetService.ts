import { Dataset } from "../database/models/Dataset";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { IDatasetRepository } from "../repositories/interfaces/IDatasetRepository";
import { logger } from "../config/logger";

/**
 * Dataset Service
 * Business logic layer for dataset operations
 */
export class DatasetService {
  private datasetRepository: IDatasetRepository;

  constructor() {
    this.datasetRepository = RepositoryFactory.createDatasetRepository();
  }

  /**
   * Create a new dataset
   */
  async createDataset(datasetData: {
    user_id: string;
    name: string;
    tags?: string[];
  }): Promise<Dataset> {
    try {
      logger.info(
        `Creating new dataset: ${datasetData.name} for user: ${datasetData.user_id}`,
      );

      // Business logic validation
      if (!datasetData.name || datasetData.name.trim().length === 0) {
        throw new Error("Dataset name is required");
      }

      if (datasetData.name.length > 100) {
        throw new Error("Dataset name cannot exceed 100 characters");
      }

      if (!datasetData.user_id) {
        throw new Error("User ID is required");
      }

      // Check if dataset with same name already exists for this user
      const nameExists = await this.datasetRepository.nameExistsForUser(
        datasetData.user_id,
        datasetData.name,
      );
      if (nameExists) {
        throw new Error(
          `Dataset with name "${datasetData.name}" already exists for this user`,
        );
      }

      // Create the dataset
      const newDataset = await this.datasetRepository.create({
        user_id: datasetData.user_id,
        name: datasetData.name.trim(),
        tags: datasetData.tags || [],
        deleted_at: null,
      } as any);

      logger.info(`Dataset created successfully with ID: ${newDataset.id}`);
      return newDataset;
    } catch (error) {
      logger.error(`Error creating dataset: ${error}`);
      throw error;
    }
  }

  /**
   * Get all datasets for a user with optional filtering
   */
  async getUserDatasets(
    userId: string,
    filters?: {
      tags?: string[];
      limit?: number;
      offset?: number;
    },
  ): Promise<{ datasets: Dataset[]; total: number }> {
    try {
      logger.info(
        `Fetching datasets for user ${userId} with filters:`,
        filters,
      );

      if (!userId) {
        throw new Error("User ID is required");
      }

      let datasets: Dataset[];

      if (filters?.tags && filters.tags.length > 0) {
        // Filter by user and tags
        datasets = await this.datasetRepository.findByUserWithTags(
          userId,
          filters.tags,
        );
      } else {
        // Get all datasets for user
        datasets = await this.datasetRepository.findByUserId(userId);
      }

      const total = datasets.length;

      // Apply pagination if specified
      if (filters?.limit) {
        const offset = filters.offset || 0;
        datasets = datasets.slice(offset, offset + filters.limit);
      }

      logger.info(
        `Found ${datasets.length} datasets out of ${total} total for user ${userId}`,
      );
      return { datasets, total };
    } catch (error) {
      logger.error(`Error fetching user datasets: ${error}`);
      throw error;
    }
  }

  /**
   * Get all datasets by tags (across all users)
   */
  async getDatasetsByTags(tags: string[]): Promise<Dataset[]> {
    try {
      logger.info("Fetching datasets by tags:", tags);

      if (!tags || tags.length === 0) {
        throw new Error("At least one tag is required");
      }

      const datasets = await this.datasetRepository.findByTags(tags);

      logger.info(`Found ${datasets.length} datasets with specified tags`);
      return datasets;
    } catch (error) {
      logger.error(`Error fetching datasets by tags: ${error}`);
      throw error;
    }
  }

  /**
   * Get dataset by ID
   */
  async getDatasetById(id: string): Promise<Dataset | null> {
    try {
      logger.info(`Fetching dataset with ID: ${id}`);

      if (!id || id.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      const dataset = await this.datasetRepository.findById(id);

      if (!dataset) {
        logger.warn(`Dataset with ID ${id} not found`);
        return null;
      }

      logger.info(`Dataset found: ${dataset.name}`);
      return dataset;
    } catch (error) {
      logger.error(`Error fetching dataset by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Update dataset
   */
  async updateDataset(
    id: string,
    userId: string,
    updateData: {
      name?: string;
      tags?: string[];
    },
  ): Promise<Dataset | null> {
    try {
      logger.info(`Updating dataset with ID: ${id}`);

      // Check if dataset exists and belongs to user
      const existingDataset = await this.datasetRepository.findById(id);
      if (!existingDataset) {
        throw new Error(`Dataset with ID ${id} not found`);
      }

      if (existingDataset.user_id !== userId) {
        throw new Error("You don't have permission to update this dataset");
      }

      // Validate name if provided
      if (updateData.name !== undefined) {
        if (!updateData.name || updateData.name.trim().length === 0) {
          throw new Error("Dataset name cannot be empty");
        }
        if (updateData.name.length > 100) {
          throw new Error("Dataset name cannot exceed 100 characters");
        }

        // Check if another dataset with same name exists for this user
        const nameExists = await this.datasetRepository.nameExistsForUser(
          userId,
          updateData.name,
          id,
        );
        if (nameExists) {
          throw new Error(
            `Dataset with name "${updateData.name}" already exists`,
          );
        }
      }

      // Prepare update data
      const updatePayload = { ...updateData };

      // Remove undefined values
      Object.keys(updatePayload).forEach((key) => {
        if (updatePayload[key as keyof typeof updatePayload] === undefined) {
          delete updatePayload[key as keyof typeof updatePayload];
        }
      });

      const updatedDataset = await this.datasetRepository.update(
        id,
        updatePayload,
      );

      logger.info(`Dataset updated successfully: ${updatedDataset?.name}`);
      return updatedDataset;
    } catch (error) {
      logger.error(`Error updating dataset: ${error}`);
      throw error;
    }
  }

  /**
   * Update dataset tags specifically
   */
  async updateDatasetTags(
    id: string,
    userId: string,
    tags: string[],
  ): Promise<Dataset | null> {
    try {
      logger.info(`Updating tags for dataset with ID: ${id}`);

      // Check if dataset exists and belongs to user
      const existingDataset = await this.datasetRepository.findById(id);
      if (!existingDataset) {
        throw new Error(`Dataset with ID ${id} not found`);
      }

      if (existingDataset.user_id !== userId) {
        throw new Error("You don't have permission to update this dataset");
      }

      // Validate tags
      if (!Array.isArray(tags)) {
        throw new Error("Tags must be an array");
      }

      // Filter out empty tags and trim
      const cleanTags = tags
        .filter((tag) => tag && typeof tag === "string")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const updatedDataset = await this.datasetRepository.updateTags(
        id,
        cleanTags,
      );

      logger.info(
        `Dataset tags updated successfully for dataset: ${updatedDataset?.name}`,
      );
      return updatedDataset;
    } catch (error) {
      logger.error(`Error updating dataset tags: ${error}`);
      throw error;
    }
  }

  /**
   * Soft delete dataset
   */
  async deleteDataset(id: string, userId: string): Promise<boolean> {
    try {
      logger.info(`Soft deleting dataset with ID: ${id}`);

      // Check if dataset exists and belongs to user
      const existingDataset = await this.datasetRepository.findById(id);
      if (!existingDataset) {
        throw new Error(`Dataset with ID ${id} not found`);
      }

      if (existingDataset.user_id !== userId) {
        throw new Error("You don't have permission to delete this dataset");
      }

      // Business logic: Check if dataset has associated videos
      // This would typically involve checking relationships
      // For now, we'll proceed with soft deletion

      const deleted = await this.datasetRepository.softDelete(id);

      if (deleted) {
        logger.info(`Dataset with ID ${id} soft deleted successfully`);
      } else {
        logger.warn(`Failed to soft delete dataset with ID ${id}`);
      }

      return deleted;
    } catch (error) {
      logger.error(`Error deleting dataset: ${error}`);
      throw error;
    }
  }

  /**
   * Restore soft deleted dataset
   */
  async restoreDataset(id: string, userId: string): Promise<boolean> {
    try {
      logger.info(`Restoring dataset with ID: ${id}`);

      // For restore, we need to check including deleted records
      const allDatasets =
        await this.datasetRepository.findAllIncludingDeleted();
      const dataset = allDatasets.find((d) => d.id === id);

      if (!dataset) {
        throw new Error(`Dataset with ID ${id} not found`);
      }

      if (dataset.user_id !== userId) {
        throw new Error("You don't have permission to restore this dataset");
      }

      const restored = await this.datasetRepository.restore(id);

      if (restored) {
        logger.info(`Dataset with ID ${id} restored successfully`);
      } else {
        logger.warn(`Failed to restore dataset with ID ${id}`);
      }

      return restored;
    } catch (error) {
      logger.error(`Error restoring dataset: ${error}`);
      throw error;
    }
  }

  /**
   * Get dataset statistics for a user
   */
  async getUserDatasetStats(userId: string): Promise<{
    totalDatasets: number;
    totalTags: number;
    topTags: Array<{ tag: string; count: number }>;
  }> {
    try {
      logger.info(`Fetching dataset statistics for user: ${userId}`);

      if (!userId) {
        throw new Error("User ID is required");
      }

      const userDatasets = await this.datasetRepository.findByUserId(userId);

      // Get unique tags and count occurrences
      const tagCounts = new Map<string, number>();
      userDatasets.forEach((dataset) => {
        if (dataset.tags && Array.isArray(dataset.tags)) {
          dataset.tags.forEach((tag) => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          });
        }
      });

      // Sort tags by count (descending) and get top 10
      const topTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      const stats = {
        totalDatasets: userDatasets.length,
        totalTags: tagCounts.size,
        topTags,
      };

      logger.info(`Dataset statistics for user ${userId}:`, stats);
      return stats;
    } catch (error) {
      logger.error(`Error fetching user dataset statistics: ${error}`);
      throw error;
    }
  }

  /**
   * Search datasets by name pattern for a user
   */
  async searchUserDatasets(
    userId: string,
    namePattern: string,
  ): Promise<Dataset[]> {
    try {
      logger.info(
        `Searching datasets for user ${userId} with pattern: ${namePattern}`,
      );

      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!namePattern || namePattern.trim().length === 0) {
        throw new Error("Search pattern is required");
      }

      const userDatasets = await this.datasetRepository.findByUserId(userId);

      // Simple case-insensitive search
      const searchTerm = namePattern.toLowerCase().trim();
      const matchingDatasets = userDatasets.filter((dataset) =>
        dataset.name.toLowerCase().includes(searchTerm),
      );

      logger.info(
        `Found ${matchingDatasets.length} datasets matching pattern for user ${userId}`,
      );
      return matchingDatasets;
    } catch (error) {
      logger.error(`Error searching user datasets: ${error}`);
      throw error;
    }
  }
}
