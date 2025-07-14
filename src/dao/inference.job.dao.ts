import { InferCreationAttributes } from "sequelize";
import { IDAO } from "@/dao/interfaces/idao";
import { InferenceJob } from "@/models/inference.job";
import { ErrorCode } from "bullmq";
import { ErrorEnum, getError } from "@/utils/api.error";

/**
 * InferenceJobDAO class implements IDAO interface for InferenceJob model
 * Provides methods to create, retrieve, update, and delete inference jobs
 */
export class InferenceJobDAO implements IDAO<InferenceJob> {
  async get(id: string): Promise<InferenceJob | null> {
    return InferenceJob.findByPk(id);
  }

  /**
   * Retrieves all inference jobs
   * @returns Promise<InferenceJob[]> - Array of all inference jobs
   */
  async getAll(): Promise<InferenceJob[]> {
    return InferenceJob.findAll();
  }

  /**
   * Updates an inference job by its ID
   * @param id - The ID of the inference job to update
   * @param data - The new data for the inference job
   * @returns Promise<InferenceJob | null> - The updated inference job if found, null otherwise
   */
  async update(
    id: string,
    data: Partial<InferenceJob>,
  ): Promise<InferenceJob | null> {
    const update_inference_job = await this.get(id);

    if (!update_inference_job) {
      return null;
    }

    return update_inference_job.update(data);
  }

  /**
   * Deletes an inference job by its ID
   * @param id - The ID of the inference job to delete
   * @returns Promise<boolean> - True if the inference job was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const delete_inference_job = await this.get(id);

    if (!delete_inference_job) {
      return false;
    }
    await delete_inference_job.destroy();
    return true;
  }

  /**
   * Creates a new inference job
   * @param data - The data for the new inference job
   * @returns Promise<string> - The ID of the created inference job
   */
  async create(data: InferCreationAttributes<InferenceJob>): Promise<string> {
    const new_inference_job = await InferenceJob.create(data);

    if (!new_inference_job.id) {
      throw getError(ErrorEnum.GENERIC_ERROR).getErrorObj();
    }

    return new_inference_job.id;
  }
}
