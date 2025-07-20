import { InferenceJob } from "@/models";
import { InferenceJobDAO } from "@/dao/inference.job.dao";
import { InferenceJobStatus } from "@/common/enums";
import { InferCreationAttributes } from "sequelize";

/**
 * InferenceJobRepository is responsible for managing inference job data.
 * It provides methods to create, find, update, and delete inference jobs.
 */
export class InferenceJobRepository {
  private inferenceJobDAO: InferenceJobDAO;

  constructor() {
    this.inferenceJobDAO = new InferenceJobDAO();
  }

  /**
   * Creates a new inference job
   * @param inferenceJobData - The data for the new inference job
   * @returns A Promise that resolves the inference job
   */
  async createInferenceJob(
    inferenceJobData: InferCreationAttributes<InferenceJob>,
  ): Promise<InferenceJob> {
    return await this.inferenceJobDAO.create(inferenceJobData);
  }

  /**
   * Finds an inference job by ID
   * @param id - The ID of the inference job
   * @returns A Promise that resolves to the inference job
   */
  async findById(id: string): Promise<InferenceJob> {
    return await this.inferenceJobDAO.get(id);
  }

  /**
   * Retrieves all inference jobs
   * @returns A Promise that resolves to an array of all inference jobs
   */
  async findAll(): Promise<InferenceJob[]> {
    return await this.inferenceJobDAO.getAll();
  }

  /**
   * Updates an inference job
   * @param id - The ID of the inference job to update
   * @param updateData - The data to update
   * @returns A Promise that resolves to the updated inference job
   */
  async updateInferenceJob(
    id: string,
    updateData: Partial<InferenceJob>,
  ): Promise<InferenceJob> {
    return await this.inferenceJobDAO.update(id, updateData);
  }

  /**
   * Updates the status of an inference job
   * @param id - The ID of the inference job
   * @param status - The new status
   * @returns A Promise that resolves to the updated inference job
   */
  async updateStatus(
    id: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob> {
    return await this.inferenceJobDAO.update(id, { status });
  }

  /**
   * Deletes an inference job
   * @param id - The ID of the inference job to delete
   */
  async deleteInferenceJob(id: string): Promise<void> {
    await this.inferenceJobDAO.delete(id);
  }

  /**
   * Finds inference jobs by user ID
   * @param userId - The user ID
   * @returns A Promise that resolves to an array of inference jobs for the user
   */
  async findByUserId(userId: string): Promise<InferenceJob[]> {
    const allJobs = await this.inferenceJobDAO.getAll();
    return allJobs.filter((job) => job.user_id === userId);
  }

  /**
   * Finds inference jobs by dataset ID
   * @param datasetId - The dataset ID
   * @returns A Promise that resolves to an array of inference jobs for the dataset
   */
  async findByDatasetId(datasetId: string): Promise<InferenceJob[]> {
    const allJobs = await this.inferenceJobDAO.getAll();
    return allJobs.filter((job) => job.dataset_id === datasetId);
  }
}
