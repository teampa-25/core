import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao";
import { InferenceJob } from "@/models";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";

/**
 * InferenceJobDAO class implements IDAO interface for InferenceJob model
 * Provides methods to create, retrieve, update, and delete inference jobs
 */
export class InferenceJobDAO implements IDAO<InferenceJob> {
  /**
   * Retrieves an inference job by its ID
   * @param id - The ID of the inference job to retrieve
   * @returns A Promise that resolves to the inference job
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<InferenceJob> {
    try {
      const inferenceJob = await InferenceJob.findByPk(id);
      if (!inferenceJob) throw getError(ErrorEnum.NOT_FOUND_ERROR);
      return inferenceJob;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all inference jobs
   * @returns A Promise that resolves to an array of all inference jobs
   * @throws Error if the retrieval operation fails
   */
  async getAll(): Promise<InferenceJob[]> {
    try {
      return await InferenceJob.findAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an inference job by its ID
   * @param id - The ID of the inference job to update
   * @param data - The new data for the inference job
   * @returns A Promise that resolves to the updated inference job
   * @throws Error if the update operation fails
   */
  async update(id: string, data: Partial<InferenceJob>): Promise<InferenceJob> {
    try {
      const updateInferencejob = await this.get(id);
      return await updateInferencejob.update(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes an inference job by its ID
   * @param id - The ID of the inference job to delete
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<void> {
    try {
      const deleteInferencejob = await this.get(id);
      await deleteInferencejob.destroy();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new inference job
   * @param data - The data for the new inference job
   * @returns A Promise that resolves to the created inference job
   * @throws Error if the creation operation fails
   */
  async create(
    data: InferCreationAttributes<InferenceJob>,
  ): Promise<InferenceJob> {
    try {
      return await InferenceJob.create(data);
    } catch (error) {
      throw error;
    }
  }
}
