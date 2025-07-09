import { Result } from "../database/models";
import { Op, InferAttributes, InferCreationAttributes } from "sequelize";
import { SequelizeBaseDAO } from "./base/SequelizeBaseDAO";

// helpers for better type safety and consistency
export type ResultCreateAttributes = InferCreationAttributes<Result>;
export type ResultUpdateAttributes = Partial<InferAttributes<Result>>;

/**
 * Result DAO class for database operations
 * Extends the base DAO with Result-specific methods
 */
export class ResultDAO extends SequelizeBaseDAO<
  Result,
  ResultCreateAttributes,
  ResultUpdateAttributes
> {
  constructor() {
    super(Result);
  }

  /**
   * Find result by inference job ID
   * @param inferenceJobId - The inference job ID to search for
   * @returns Promise of the result or null if not found
   */
  async findByInferenceJobId(inferenceJobId: string): Promise<Result | null> {
    try {
      return await this.findOneBy({ inferenceJob_id: inferenceJobId });
    } catch (error) {
      throw new Error(
        `Error finding result for inference job ${inferenceJobId}: ${error}`,
      );
    }
  }

  /**
   * Update JSON result
   * @param id - Result ID
   * @param jsonRes - New JSON result
   * @returns Promise of the updated result or null if not found
   */
  async updateJsonResult(id: string, jsonRes: object): Promise<Result | null> {
    try {
      return await this.update(id, { json_res: jsonRes });
    } catch (error) {
      throw new Error(`Error updating JSON result for ${id}: ${error}`);
    }
  }

  /**
   * Update image ZIP
   * @param id - Result ID
   * @param imageZip - New image ZIP buffer
   * @returns Promise of the updated result or null if not found
   */
  async updateImageZip(id: string, imageZip: Buffer): Promise<Result | null> {
    try {
      return await this.update(id, { image_zip: imageZip });
    } catch (error) {
      throw new Error(`Error updating image ZIP for ${id}: ${error}`);
    }
  }

  /**
   * Update both JSON result and image ZIP
   * @param id - Result ID
   * @param jsonRes - New JSON result
   * @param imageZip - New image ZIP buffer
   * @returns Promise of the updated result or null if not found
   */
  async updateComplete(
    id: string,
    jsonRes: object,
    imageZip: Buffer,
  ): Promise<Result | null> {
    try {
      return await this.update(id, { json_res: jsonRes, image_zip: imageZip });
    } catch (error) {
      throw new Error(`Error updating complete result for ${id}: ${error}`);
    }
  }

  /**
   * Get result with JSON data only (without image ZIP for performance)
   * @param inferenceJobId - The inference job ID
   * @returns Promise of result with only JSON data or null if not found
   */
  async getJsonResultOnly(
    inferenceJobId: string,
  ): Promise<{ id: string; json_res: object } | null> {
    try {
      const result = await this.model.findOne({
        where: { inferenceJob_id: inferenceJobId },
        attributes: ["id", "json_res"],
      });
      return result ? { id: result.id, json_res: result.json_res } : null;
    } catch (error) {
      throw new Error(
        `Error getting JSON result for inference job ${inferenceJobId}: ${error}`,
      );
    }
  }

  /**
   * Get image ZIP only (without JSON for performance)
   * @param inferenceJobId - The inference job ID
   * @returns Promise of image ZIP buffer or null if not found
   */
  async getImageZipOnly(inferenceJobId: string): Promise<Buffer | null> {
    try {
      const result = await this.model.findOne({
        where: { inferenceJob_id: inferenceJobId },
        attributes: ["image_zip"],
      });
      return result ? result.image_zip : null;
    } catch (error) {
      throw new Error(
        `Error getting image ZIP for inference job ${inferenceJobId}: ${error}`,
      );
    }
  }

  /**
   * Check if result exists for inference job
   * @param inferenceJobId - The inference job ID
   * @returns Promise of boolean indicating if result exists
   */
  async existsForInferenceJob(inferenceJobId: string): Promise<boolean> {
    try {
      const count = await this.count({ inferenceJob_id: inferenceJobId });
      return count > 0;
    } catch (error) {
      throw new Error(
        `Error checking if result exists for inference job ${inferenceJobId}: ${error}`,
      );
    }
  }

  /**
   * Delete result by inference job ID
   * @param inferenceJobId - The inference job ID
   * @returns Promise of boolean indicating success
   */
  async deleteByInferenceJobId(inferenceJobId: string): Promise<boolean> {
    try {
      const deletedRowsCount = await this.model.destroy({
        where: { inferenceJob_id: inferenceJobId },
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw new Error(
        `Error deleting result for inference job ${inferenceJobId}: ${error}`,
      );
    }
  }

  /**
   * Get results created within date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise of array of results
   */
  async findResultsInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Result[]> {
    try {
      return (await this.model.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["created_at", "DESC"]],
      })) as Result[];
    } catch (error) {
      throw new Error(`Error finding results in date range: ${error}`);
    }
  }

  /**
   * Get storage usage statistics
   * @returns Promise of storage statistics
   */
  async getStorageStats(): Promise<{
    totalResults: number;
    totalJsonSize: number;
    totalImageZipSize: number;
  }> {
    try {
      const results = await this.findAll();

      const stats = {
        totalResults: results.length,
        totalJsonSize: 0,
        totalImageZipSize: 0,
      };

      results.forEach((result) => {
        stats.totalJsonSize += JSON.stringify(result.json_res).length;
        stats.totalImageZipSize += result.image_zip.length;
      });

      return stats;
    } catch (error) {
      throw new Error(`Error calculating storage stats: ${error}`);
    }
  }
}
