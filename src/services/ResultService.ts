import { Result } from "../database/models/Result";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { IResultRepository } from "../repositories/interfaces/IResultRepository";
import { logger } from "../config/logger";

/**
 * Result Service
 * Business logic layer for result operations
 */
export class ResultService {
  private resultRepository: IResultRepository;

  constructor() {
    this.resultRepository = RepositoryFactory.createResultRepository();
  }

  /**
   * Create a new result
   */
  async createResult(resultData: {
    inferenceJob_id: string;
    json_res: object;
    image_zip: Buffer;
  }): Promise<Result> {
    try {
      logger.info(
        `Creating new result for inference job: ${resultData.inferenceJob_id}`,
      );

      // Business logic validation
      if (
        !resultData.inferenceJob_id ||
        resultData.inferenceJob_id.trim().length === 0
      ) {
        throw new Error("Inference job ID is required");
      }

      if (!resultData.json_res || typeof resultData.json_res !== "object") {
        throw new Error("JSON result is required and must be an object");
      }

      if (!resultData.image_zip || resultData.image_zip.length === 0) {
        throw new Error("Image ZIP is required");
      }

      // Check if result already exists for this inference job
      const existingResult = await this.resultRepository.findByInferenceJobId(
        resultData.inferenceJob_id,
      );
      if (existingResult) {
        throw new Error(
          `Result already exists for inference job ${resultData.inferenceJob_id}`,
        );
      }

      // Create the result
      const newResult = await this.resultRepository.create({
        inferenceJob_id: resultData.inferenceJob_id,
        json_res: resultData.json_res,
        image_zip: resultData.image_zip,
      } as any);

      logger.info(`Result created successfully with ID: ${newResult.id}`);
      return newResult;
    } catch (error) {
      logger.error(`Error creating result: ${error}`);
      throw error;
    }
  }

  /**
   * Get result by ID
   */
  async getResultById(id: string): Promise<Result | null> {
    try {
      logger.info(`Fetching result with ID: ${id}`);

      if (!id || id.trim().length === 0) {
        throw new Error("Result ID is required");
      }

      const result = await this.resultRepository.findById(id);

      if (!result) {
        logger.warn(`Result with ID ${id} not found`);
        return null;
      }

      logger.info(`Result found for inference job: ${result.inferenceJob_id}`);
      return result;
    } catch (error) {
      logger.error(`Error fetching result by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Get result by inference job ID
   */
  async getResultByInferenceJobId(
    inferenceJobId: string,
  ): Promise<Result | null> {
    try {
      logger.info(`Fetching result for inference job: ${inferenceJobId}`);

      if (!inferenceJobId || inferenceJobId.trim().length === 0) {
        throw new Error("Inference job ID is required");
      }

      const result =
        await this.resultRepository.findByInferenceJobId(inferenceJobId);

      if (!result) {
        logger.warn(`Result for inference job ${inferenceJobId} not found`);
        return null;
      }

      logger.info(`Result found: ${result.id}`);
      return result;
    } catch (error) {
      logger.error(`Error fetching result by inference job ID: ${error}`);
      throw error;
    }
  }

  /**
   * Get results by user ID
   */
  async getUserResults(
    userId: string,
    filters?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<{ results: Result[]; total: number }> {
    try {
      logger.info(`Fetching results for user: ${userId}`);

      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      let results = await this.resultRepository.findByUserId(userId);
      const total = results.length;

      // Apply pagination if specified
      if (filters?.limit) {
        const offset = filters.offset || 0;
        results = results.slice(offset, offset + filters.limit);
      }

      logger.info(`Found ${results.length} results for user ${userId}`);
      return { results, total };
    } catch (error) {
      logger.error(`Error fetching user results: ${error}`);
      throw error;
    }
  }

  /**
   * Get results by dataset ID
   */
  async getDatasetResults(datasetId: string): Promise<Result[]> {
    try {
      logger.info(`Fetching results for dataset: ${datasetId}`);

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      const results = await this.resultRepository.findByDatasetId(datasetId);

      logger.info(`Found ${results.length} results for dataset ${datasetId}`);
      return results;
    } catch (error) {
      logger.error(`Error fetching dataset results: ${error}`);
      throw error;
    }
  }

  /**
   * Update JSON result
   */
  async updateJsonResult(id: string, jsonRes: object): Promise<Result | null> {
    try {
      logger.info(`Updating JSON result for ID: ${id}`);

      // Check if result exists
      const existingResult = await this.resultRepository.findById(id);
      if (!existingResult) {
        throw new Error(`Result with ID ${id} not found`);
      }

      // Validate JSON data
      if (!jsonRes || typeof jsonRes !== "object") {
        throw new Error("JSON result must be a valid object");
      }

      const updatedResult = await this.resultRepository.updateJsonResult(
        id,
        jsonRes,
      );

      logger.info(`JSON result updated successfully for ID: ${id}`);
      return updatedResult;
    } catch (error) {
      logger.error(`Error updating JSON result: ${error}`);
      throw error;
    }
  }

  /**
   * Update image ZIP
   */
  async updateImageZip(id: string, imageZip: Buffer): Promise<Result | null> {
    try {
      logger.info(`Updating image ZIP for result ID: ${id}`);

      // Check if result exists
      const existingResult = await this.resultRepository.findById(id);
      if (!existingResult) {
        throw new Error(`Result with ID ${id} not found`);
      }

      // Validate image ZIP
      if (!imageZip || imageZip.length === 0) {
        throw new Error("Image ZIP cannot be empty");
      }

      const updatedResult = await this.resultRepository.updateImageZip(
        id,
        imageZip,
      );

      logger.info(`Image ZIP updated successfully for result ID: ${id}`);
      return updatedResult;
    } catch (error) {
      logger.error(`Error updating image ZIP: ${error}`);
      throw error;
    }
  }

  /**
   * Delete result
   */
  async deleteResult(id: string): Promise<boolean> {
    try {
      logger.info(`Deleting result with ID: ${id}`);

      // Check if result exists
      const existingResult = await this.resultRepository.findById(id);
      if (!existingResult) {
        throw new Error(`Result with ID ${id} not found`);
      }

      const deleted = await this.resultRepository.delete(id);

      if (deleted) {
        logger.info(`Result with ID ${id} deleted successfully`);
      } else {
        logger.warn(`Failed to delete result with ID ${id}`);
      }

      return deleted;
    } catch (error) {
      logger.error(`Error deleting result: ${error}`);
      throw error;
    }
  }

  /**
   * Delete result by inference job ID
   */
  async deleteResultByInferenceJobId(inferenceJobId: string): Promise<boolean> {
    try {
      logger.info(`Deleting result for inference job: ${inferenceJobId}`);

      if (!inferenceJobId || inferenceJobId.trim().length === 0) {
        throw new Error("Inference job ID is required");
      }

      const deleted =
        await this.resultRepository.deleteByInferenceJobId(inferenceJobId);

      if (deleted) {
        logger.info(
          `Result deleted successfully for inference job: ${inferenceJobId}`,
        );
      } else {
        logger.warn(`No result found for inference job: ${inferenceJobId}`);
      }

      return deleted;
    } catch (error) {
      logger.error(`Error deleting result by inference job ID: ${error}`);
      throw error;
    }
  }

  /**
   * Check if result exists for inference job
   */
  async checkResultExists(inferenceJobId: string): Promise<boolean> {
    try {
      logger.info(
        `Checking if result exists for inference job: ${inferenceJobId}`,
      );

      if (!inferenceJobId || inferenceJobId.trim().length === 0) {
        throw new Error("Inference job ID is required");
      }

      const exists =
        await this.resultRepository.existsForInferenceJob(inferenceJobId);

      logger.info(
        `Result exists for inference job ${inferenceJobId}: ${exists}`,
      );
      return exists;
    } catch (error) {
      logger.error(`Error checking result existence: ${error}`);
      throw error;
    }
  }

  /**
   * Get storage size for result
   */
  async getResultStorageSize(id: string): Promise<number> {
    try {
      logger.info(`Getting storage size for result: ${id}`);

      if (!id || id.trim().length === 0) {
        throw new Error("Result ID is required");
      }

      const storageSize = await this.resultRepository.getStorageSize(id);

      logger.info(`Storage size for result ${id}: ${storageSize} bytes`);
      return storageSize;
    } catch (error) {
      logger.error(`Error getting result storage size: ${error}`);
      throw error;
    }
  }

  /**
   * Get total storage size for user results
   */
  async getUserTotalStorageSize(userId: string): Promise<number> {
    try {
      logger.info(`Getting total storage size for user: ${userId}`);

      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      const totalSize =
        await this.resultRepository.getTotalStorageSizeForUser(userId);

      logger.info(`Total storage size for user ${userId}: ${totalSize} bytes`);
      return totalSize;
    } catch (error) {
      logger.error(`Error getting user total storage size: ${error}`);
      throw error;
    }
  }

  /**
   * Get results count for user
   */
  async getUserResultsCount(userId: string): Promise<number> {
    try {
      logger.info(`Getting results count for user: ${userId}`);

      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      const count = await this.resultRepository.getResultsCountForUser(userId);

      logger.info(`Results count for user ${userId}: ${count}`);
      return count;
    } catch (error) {
      logger.error(`Error getting user results count: ${error}`);
      throw error;
    }
  }

  /**
   * Get results by date range
   */
  async getResultsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Result[]> {
    try {
      logger.info(
        `Fetching results between ${startDate.toISOString()} and ${endDate.toISOString()}`,
      );

      if (startDate > endDate) {
        throw new Error("Start date must be before end date");
      }

      const results = await this.resultRepository.findResultsByDateRange(
        startDate,
        endDate,
      );

      logger.info(`Found ${results.length} results in date range`);
      return results;
    } catch (error) {
      logger.error(`Error fetching results by date range: ${error}`);
      throw error;
    }
  }

  /**
   * Get user result statistics
   */
  async getUserResultStatistics(userId: string): Promise<{
    totalResults: number;
    totalStorageSize: number;
    averageStorageSize: number;
    oldestResult: Result | null;
    newestResult: Result | null;
  }> {
    try {
      logger.info(`Fetching result statistics for user: ${userId}`);

      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      const userResults = await this.resultRepository.findByUserId(userId);

      if (userResults.length === 0) {
        return {
          totalResults: 0,
          totalStorageSize: 0,
          averageStorageSize: 0,
          oldestResult: null,
          newestResult: null,
        };
      }

      const totalResults = userResults.length;
      const totalStorageSize =
        await this.resultRepository.getTotalStorageSizeForUser(userId);
      const averageStorageSize = Math.round(totalStorageSize / totalResults);

      // Sort by creation date
      const sortedResults = userResults.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      const oldestResult = sortedResults[0];
      const newestResult = sortedResults[sortedResults.length - 1];

      const statistics = {
        totalResults,
        totalStorageSize,
        averageStorageSize,
        oldestResult,
        newestResult,
      };

      logger.info(`Result statistics for user ${userId}:`, {
        totalResults,
        totalStorageSize,
        averageStorageSize,
      });

      return statistics;
    } catch (error) {
      logger.error(`Error fetching user result statistics: ${error}`);
      throw error;
    }
  }

  /**
   * Get system result statistics
   */
  async getSystemResultStatistics(): Promise<{
    totalResults: number;
    totalStorageSize: number;
    averageStorageSize: number;
    resultsByDate: Array<{ date: string; count: number }>;
  }> {
    try {
      logger.info("Fetching system-wide result statistics");

      const allResults = await this.resultRepository.findAll();

      if (allResults.length === 0) {
        return {
          totalResults: 0,
          totalStorageSize: 0,
          averageStorageSize: 0,
          resultsByDate: [],
        };
      }

      const totalResults = allResults.length;

      // Calculate total storage size (assuming all results are counted)
      let totalStorageSize = 0;
      for (const result of allResults) {
        totalStorageSize += await this.resultRepository.getStorageSize(
          result.id,
        );
      }

      const averageStorageSize = Math.round(totalStorageSize / totalResults);

      // Group results by date
      const resultsByDate = allResults.reduce(
        (acc, result) => {
          const date = new Date(result.created_at).toISOString().split("T")[0];
          const existing = acc.find((item) => item.date === date);

          if (existing) {
            existing.count++;
          } else {
            acc.push({ date, count: 1 });
          }

          return acc;
        },
        [] as Array<{ date: string; count: number }>,
      );

      // Sort by date
      resultsByDate.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      const statistics = {
        totalResults,
        totalStorageSize,
        averageStorageSize,
        resultsByDate,
      };

      logger.info("System result statistics:", {
        totalResults,
        totalStorageSize,
        averageStorageSize,
        datesCount: resultsByDate.length,
      });

      return statistics;
    } catch (error) {
      logger.error(`Error fetching system result statistics: ${error}`);
      throw error;
    }
  }

  /**
   * Create or update result
   */
  async createOrUpdateResult(resultData: {
    inferenceJob_id: string;
    json_res: object;
    image_zip: Buffer;
  }): Promise<Result> {
    try {
      logger.info(
        `Creating or updating result for inference job: ${resultData.inferenceJob_id}`,
      );

      // Check if result already exists
      const existingResult = await this.resultRepository.findByInferenceJobId(
        resultData.inferenceJob_id,
      );

      if (existingResult) {
        // Update existing result
        logger.info(`Updating existing result: ${existingResult.id}`);

        // Update JSON result
        await this.resultRepository.updateJsonResult(
          existingResult.id,
          resultData.json_res,
        );

        // Update image ZIP
        const updatedResult = await this.resultRepository.updateImageZip(
          existingResult.id,
          resultData.image_zip,
        );

        if (!updatedResult) {
          throw new Error("Failed to update existing result");
        }

        logger.info(`Result updated successfully: ${updatedResult.id}`);
        return updatedResult;
      } else {
        // Create new result
        return this.createResult(resultData);
      }
    } catch (error) {
      logger.error(`Error creating or updating result: ${error}`);
      throw error;
    }
  }
}
