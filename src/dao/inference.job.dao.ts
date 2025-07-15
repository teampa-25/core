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
   * @returns A Promise that resolves to the inference job or null if not found
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<InferenceJob | null> {
    try {
      return await InferenceJob.findByPk(id);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
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
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Updates an inference job by its ID
   * @param id - The ID of the inference job to update
   * @param data - The new data for the inference job
   * @returns A Promise that resolves to the updated inference job or null if not found
   * @throws Error if the update operation fails
   */
  async update(
    id: string,
    data: Partial<InferenceJob>,
  ): Promise<InferenceJob | null> {
    try {
      const updateInferencejob = await this.get(id);

      if (!updateInferencejob) {
        return null;
      }

      return await updateInferencejob.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Deletes an inference job by its ID
   * @param id - The ID of the inference job to delete
   * @returns A Promise that resolves to true if the inference job was deleted, false otherwise
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<boolean> {
    try {
      const deleteInferencejob = await this.get(id);

      if (!deleteInferencejob) {
        return false;
      }
      await deleteInferencejob.destroy();
      return true;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Creates a new inference job
   * @param data - The data for the new inference job
   * @returns A Promise that resolves to the ID of the created inference job
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<InferenceJob>): Promise<string> {
    try {
      const newiInferenceJob = await InferenceJob.create(data);

      if (!newiInferenceJob.id) {
        throw getError(ErrorEnum.GENERIC_ERROR);
      }

      return newiInferenceJob.id;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }
}
