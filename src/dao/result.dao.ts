import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao";
import { Result } from "@/models";
import { ErrorEnum } from "@/common/enums";
import { getError } from "@/common/utils/api-error";

/**
 * ResultDAO class implements IDAO interface for Result model
 * Provides methods to create, retrieve, update, and delete results
 */
export class ResultDAO implements IDAO<Result> {
  /**
   * Retrieves a result by its ID
   * @param id - The ID of the result to retrieve
   * @returns A Promise that resolves to the result
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<Result> {
    try {
      const result = await Result.findByPk(id);
      if (!result) throw getError(ErrorEnum.NOT_FOUND_ERROR);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a result by its associated inference job ID
   * @param inferenceJobId - The ID of the inference job
   * @returns A Promise that resolves to the result
   */
  async getByInferenceJobId(inferenceJobId: string): Promise<Result> {
    try {
      const result = await Result.findOne({
        where: { inferenceJob_id: inferenceJobId },
      });
      if (!result) throw getError(ErrorEnum.NOT_FOUND_ERROR);
      return result;
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  /**
   * Updates a result by its ID
   * @param id - The ID of the result to update
   * @param data - The new data for the result
   * @returns A Promise that resolves to the updated result
   * @throws Error if the update operation fails
   */
  async update(id: string, data: Partial<Result>): Promise<Result> {
    try {
      const updateResult = await this.get(id);
      return await updateResult.update(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a result by its ID
   * @param id - The ID of the result to delete
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<void> {
    try {
      const deleteResult = await this.get(id);
      await deleteResult.destroy();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new result
   * @param data - The data for the new result
   * @returns A Promise that resolves to the new result
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<Result>): Promise<Result> {
    try {
      return await Result.create(data);
    } catch (error) {
      throw error;
    }
  }
}
