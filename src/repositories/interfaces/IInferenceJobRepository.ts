import { InferenceJob, InferenceJobStatus } from "../../database/models";
import {
  InferenceJobCreateAttributes,
  InferenceJobUpdateAttributes,
} from "../../dao/InferenceJobDAO";
import { IBaseRepository } from "./IBaseRepository";

/**
 * InferenceJob repository interface defining InferenceJob-specific operations
 */
export interface IInferenceJobRepository
  extends IBaseRepository<
    InferenceJob,
    InferenceJobCreateAttributes,
    InferenceJobUpdateAttributes
  > {
  /**
   * Find inference jobs by user ID
   */
  findByUserId(userId: string): Promise<InferenceJob[]>;

  /**
   * Find inference jobs by dataset ID
   */
  findByDatasetId(datasetId: string): Promise<InferenceJob[]>;

  /**
   * Find inference jobs by video ID
   */
  findByVideoId(videoId: string): Promise<InferenceJob[]>;

  /**
   * Find inference jobs by status
   */
  findByStatus(status: InferenceJobStatus): Promise<InferenceJob[]>;

  /**
   * Find inference jobs by user and status
   */
  findByUserAndStatus(
    userId: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob[]>;

  /**
   * Update job status
   */
  updateStatus(
    id: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob | null>;

  /**
   * Update carbon footprint
   */
  updateCarbonFootprint(
    id: string,
    carbonFootprint: number,
  ): Promise<InferenceJob | null>;

  /**
   * Find jobs that need processing (PENDING status)
   */
  findJobsToProcess(): Promise<InferenceJob[]>;

  /**
   * Find running jobs (RUNNING status)
   */
  findRunningJobs(): Promise<InferenceJob[]>;

  /**
   * Find completed jobs by user
   */
  findCompletedJobsByUser(userId: string): Promise<InferenceJob[]>;

  /**
   * Find failed jobs by user
   */
  findFailedJobsByUser(userId: string): Promise<InferenceJob[]>;

  /**
   * Get job statistics for user
   */
  getJobStatisticsForUser(userId: string): Promise<{
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
    aborted: number;
  }>;

  /**
   * Count jobs by status
   */
  countByStatus(status: InferenceJobStatus): Promise<number>;

  /**
   * Find jobs by date range
   */
  findJobsByDateRange(startDate: Date, endDate: Date): Promise<InferenceJob[]>;
}
