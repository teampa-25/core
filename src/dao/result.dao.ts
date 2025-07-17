import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao";
import { Result } from "@/models";
import { ErrorEnum } from "@/common/enums";
import { getError } from "@/common/utils/api-error";
import { logger } from "@/config/logger";

/**
 * ResultDAO class implements IDAO interface for Result model
 * Provides methods to create, retrieve, update, and delete results
 */
export class ResultDAO implements IDAO<Result> {
  /**
   * Retrieves a result by its ID
   * @param id - The ID of the result to retrieve
   * @returns A Promise that resolves to the result or null if not found
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<Result | null> {
    try {
      return await Result.findByPk(id);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Retrieves a result by its associated inference job ID
   * @param inferenceJobId - The ID of the inference job
   * @returns A Promise that resolves to the result or null if not found
   */
  async getByInferenceJobId(inferenceJobId: string): Promise<Result | null> {
    try {
      return await Result.findOne({
        where: { inferenceJob_id: inferenceJobId },
      });
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Retrieves all results
   * @returns A Promise that resolves to an array of all results
   */
  async getAll(): Promise<Result[]> {
    try {
      return await Result.findAll();
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Updates a result by its ID
   * @param id - The ID of the result to update
   * @param data - The new data for the result
   * @returns A Promise that resolves to the updated result or null if not found
   * @throws Error if the update operation fails
   */
  async update(id: string, data: Partial<Result>): Promise<Result | null> {
    try {
      const updateResult = await this.get(id);

      if (!updateResult) {
        return null;
      }
      return await updateResult.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Deletes a result by its ID
   * @param id - The ID of the result to delete
   * @returns A Promise that resolves to true if the result was deleted, false otherwise
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<boolean> {
    try {
      const deleteResult = await this.get(id);

      if (!deleteResult) {
        return false;
      }

      await deleteResult.destroy();
      return true;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Creates a new result
   * @param data - The data for the new result
   * @returns A Promise that resolves to the ID of the new result
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<Result>): Promise<string> {
    try {
      const newResult = await Result.create(data);

      if (!newResult.id) {
        throw getError(ErrorEnum.GENERIC_ERROR);
      }

      return newResult.id;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }
}
