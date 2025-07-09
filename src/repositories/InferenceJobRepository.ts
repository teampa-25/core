import { InferenceJob, InferenceJobStatus } from "../database/models";
import {
  InferenceJobDAO,
  InferenceJobCreateAttributes,
  InferenceJobUpdateAttributes,
} from "../dao/InferenceJobDAO";
import { IInferenceJobRepository } from "./interfaces/IInferenceJobRepository";

/**
 * InferenceJob repository implementation
 * Provides business logic layer over InferenceJobDAO
 */
export class InferenceJobRepository implements IInferenceJobRepository {
  constructor(private inferenceJobDAO: InferenceJobDAO) {}

  async create(data: InferenceJobCreateAttributes): Promise<InferenceJob> {
    return this.inferenceJobDAO.create(data);
  }

  async findById(id: string): Promise<InferenceJob | null> {
    return this.inferenceJobDAO.findById(id);
  }

  async findAll(options?: any): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findAll(options);
  }

  async update(
    id: string,
    data: InferenceJobUpdateAttributes,
  ): Promise<InferenceJob | null> {
    return this.inferenceJobDAO.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.inferenceJobDAO.delete(id);
  }

  async findBy(criteria: any): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findBy(criteria);
  }

  async findOneBy(criteria: any): Promise<InferenceJob | null> {
    return this.inferenceJobDAO.findOneBy(criteria);
  }

  async count(criteria?: any): Promise<number> {
    return this.inferenceJobDAO.count(criteria);
  }

  // InferenceJob-specific methods
  async findByUserId(userId: string): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findByUserId(userId);
  }

  async findByDatasetId(datasetId: string): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findByDatasetId(datasetId);
  }

  async findByVideoId(videoId: string): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findBy({ video_id: videoId });
  }

  async findByStatus(status: InferenceJobStatus): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findByStatus(status);
  }

  async findByUserAndStatus(
    userId: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findBy({ user_id: userId, status });
  }

  async updateStatus(
    id: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob | null> {
    return this.inferenceJobDAO.updateStatus(id, status);
  }

  async updateCarbonFootprint(
    id: string,
    carbonFootprint: number,
  ): Promise<InferenceJob | null> {
    return this.inferenceJobDAO.updateCarbonFootprint(id, carbonFootprint);
  }

  async findJobsToProcess(): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findPendingJobs();
  }

  async findRunningJobs(): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findRunningJobs();
  }

  async findCompletedJobsByUser(userId: string): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findCompletedJobsByUser(userId);
  }

  async findFailedJobsByUser(userId: string): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findFailedJobsForRetry(userId);
  }

  async getJobStatisticsForUser(userId: string): Promise<{
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
    aborted: number;
  }> {
    const stats = await this.inferenceJobDAO.getUserJobStats(userId);
    return {
      total: stats.total,
      pending: stats.pending,
      running: stats.running,
      completed: stats.completed,
      failed: stats.failed,
      aborted: stats.aborted,
    };
  }

  async countByStatus(status: InferenceJobStatus): Promise<number> {
    return this.inferenceJobDAO.count({ status });
  }

  async findJobsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<InferenceJob[]> {
    return this.inferenceJobDAO.findJobsInDateRange(startDate, endDate);
  }
}
