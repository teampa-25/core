import { InferenceJob } from "@/models";
import { InferenceJobDAO } from "@/dao/inference.job.dao";
import { InferenceJobStatus } from "@/models/enums/inference.job.status";
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
   * @returns A Promise that resolves to the inference job ID
   */
  async createInferenceJob(
    inferenceJobData: InferCreationAttributes<InferenceJob>,
  ): Promise<string> {
    return await this.inferenceJobDAO.create(inferenceJobData);
  }

  /**
   * Finds an inference job by ID
   * @param id - The ID of the inference job
   * @returns A Promise that resolves to the inference job or null if not found
   */
  async findById(id: string): Promise<InferenceJob | null> {
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
   * @returns A Promise that resolves to the updated inference job or null if not found
   */
  async updateInferenceJob(
    id: string,
    updateData: Partial<InferenceJob>,
  ): Promise<InferenceJob | null> {
    return await this.inferenceJobDAO.update(id, updateData);
  }

  /**
   * Updates the status of an inference job
   * @param id - The ID of the inference job
   * @param status - The new status
   * @returns A Promise that resolves to the updated inference job or null if not found
   */
  async updateStatus(
    id: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob | null> {
    return await this.inferenceJobDAO.update(id, { status });
  }

  /**
   * Updates the carbon footprint of an inference job
   * @param id - The ID of the inference job
   * @param carbonFootprint - The carbon footprint value
   * @returns A Promise that resolves to the updated inference job or null if not found
   */
  async updateCarbonFootprint(
    id: string,
    carbonFootprint: number,
  ): Promise<InferenceJob | null> {
    return await this.inferenceJobDAO.update(id, {
      carbon_footprint: carbonFootprint,
    });
  }

  /**
   * Deletes an inference job
   * @param id - The ID of the inference job to delete
   * @returns A Promise that resolves to true if deleted, false otherwise
   */
  async deleteInferenceJob(id: string): Promise<boolean> {
    return await this.inferenceJobDAO.delete(id);
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

  /**
   * Finds inference jobs by video ID
   * @param videoId - The video ID
   * @returns A Promise that resolves to an array of inference jobs for the video
   */
  async findByVideoId(videoId: string): Promise<InferenceJob[]> {
    const allJobs = await this.inferenceJobDAO.getAll();
    return allJobs.filter((job) => job.video_id === videoId);
  }

  /**
   * Finds inference jobs by status
   * @param status - The status to filter by
   * @returns A Promise that resolves to an array of inference jobs with the specified status
   */
  async findByStatus(status: InferenceJobStatus): Promise<InferenceJob[]> {
    const allJobs = await this.inferenceJobDAO.getAll();
    return allJobs.filter((job) => job.status === status);
  }

  /**
   * Checks if an inference job exists
   * @param id - The ID of the inference job
   * @returns A Promise that resolves to true if the job exists, false otherwise
   */
  async exists(id: string): Promise<boolean> {
    const job = await this.inferenceJobDAO.get(id);
    return job !== null;
  }

  /**
   * Marks an inference job as completed
   * @param id - The ID of the inference job
   * @returns A Promise that resolves to the updated inference job or null if not found
   */
  async markAsCompleted(id: string): Promise<InferenceJob | null> {
    return await this.updateStatus(id, InferenceJobStatus.COMPLETED);
  }

  /**
   * Marks an inference job as failed
   * @param id - The ID of the inference job
   * @returns A Promise that resolves to the updated inference job or null if not found
   */
  async markAsFailed(id: string): Promise<InferenceJob | null> {
    return await this.updateStatus(id, InferenceJobStatus.FAILED);
  }

  /**
   * Marks an inference job as running
   * @param id - The ID of the inference job
   * @returns A Promise that resolves to the updated inference job or null if not found
   */
  async markAsRunning(id: string): Promise<InferenceJob | null> {
    return await this.updateStatus(id, InferenceJobStatus.RUNNING);
  }

  /**
   * Marks an inference job as aborted
   * @param id - The ID of the inference job
   * @returns A Promise that resolves to the updated inference job or null if not found
   */
  async markAsAborted(id: string): Promise<InferenceJob | null> {
    return await this.updateStatus(id, InferenceJobStatus.ABORTED);
  }
}
