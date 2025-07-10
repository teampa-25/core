import {
  InferenceJob,
  InferenceJobStatus,
} from "../database/models/InferenceJob";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { IInferenceJobRepository } from "../repositories/interfaces/IInferenceJobRepository";
import { logger } from "../config/logger";

/**
 * InferenceJob Service
 * Business logic layer for inference job operations
 */
export class InferenceJobService {
  private inferenceJobRepository: IInferenceJobRepository;

  constructor() {
    this.inferenceJobRepository =
      RepositoryFactory.createInferenceJobRepository();
  }

  /**
   * Create a new inference job
   */
  async createInferenceJob(jobData: {
    dataset_id: string;
    user_id: string;
    video_id: string;
    params: object;
  }): Promise<InferenceJob> {
    try {
      logger.info(`Creating new inference job for user ${jobData.user_id}`);

      // Business logic validation
      if (!jobData.dataset_id || jobData.dataset_id.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      if (!jobData.user_id || jobData.user_id.trim().length === 0) {
        throw new Error("User ID is required");
      }

      if (!jobData.video_id || jobData.video_id.trim().length === 0) {
        throw new Error("Video ID is required");
      }

      if (!jobData.params || typeof jobData.params !== "object") {
        throw new Error("Job parameters are required and must be an object");
      }

      // Create the inference job
      const newJob = await this.inferenceJobRepository.create({
        dataset_id: jobData.dataset_id,
        user_id: jobData.user_id,
        video_id: jobData.video_id,
        status: InferenceJobStatus.PENDING,
        params: jobData.params,
        carbon_footprint: 0,
      } as any);

      logger.info(`Inference job created successfully with ID: ${newJob.id}`);
      return newJob;
    } catch (error) {
      logger.error(`Error creating inference job: ${error}`);
      throw error;
    }
  }

  /**
   * Get inference job by ID
   */
  async getInferenceJobById(id: string): Promise<InferenceJob | null> {
    try {
      logger.info(`Fetching inference job with ID: ${id}`);

      if (!id || id.trim().length === 0) {
        throw new Error("Inference job ID is required");
      }

      const job = await this.inferenceJobRepository.findById(id);

      if (!job) {
        logger.warn(`Inference job with ID ${id} not found`);
        return null;
      }

      logger.info(`Inference job found: ${job.status}`);
      return job;
    } catch (error) {
      logger.error(`Error fetching inference job by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Get inference jobs by user ID
   */
  async getUserInferenceJobs(
    userId: string,
    filters?: {
      status?: InferenceJobStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ jobs: InferenceJob[]; total: number }> {
    try {
      logger.info(`Fetching inference jobs for user: ${userId}`);

      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      let jobs: InferenceJob[];

      if (filters?.status) {
        jobs = await this.inferenceJobRepository.findByUserAndStatus(
          userId,
          filters.status,
        );
      } else {
        jobs = await this.inferenceJobRepository.findByUserId(userId);
      }

      const total = jobs.length;

      // Apply pagination if specified
      if (filters?.limit) {
        const offset = filters.offset || 0;
        jobs = jobs.slice(offset, offset + filters.limit);
      }

      logger.info(`Found ${jobs.length} inference jobs for user ${userId}`);
      return { jobs, total };
    } catch (error) {
      logger.error(`Error fetching user inference jobs: ${error}`);
      throw error;
    }
  }

  /**
   * Get inference jobs by dataset
   */
  async getDatasetInferenceJobs(datasetId: string): Promise<InferenceJob[]> {
    try {
      logger.info(`Fetching inference jobs for dataset: ${datasetId}`);

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      const jobs = await this.inferenceJobRepository.findByDatasetId(datasetId);

      logger.info(
        `Found ${jobs.length} inference jobs for dataset ${datasetId}`,
      );
      return jobs;
    } catch (error) {
      logger.error(`Error fetching dataset inference jobs: ${error}`);
      throw error;
    }
  }

  /**
   * Get inference jobs by video
   */
  async getVideoInferenceJobs(videoId: string): Promise<InferenceJob[]> {
    try {
      logger.info(`Fetching inference jobs for video: ${videoId}`);

      if (!videoId || videoId.trim().length === 0) {
        throw new Error("Video ID is required");
      }

      const jobs = await this.inferenceJobRepository.findByVideoId(videoId);

      logger.info(`Found ${jobs.length} inference jobs for video ${videoId}`);
      return jobs;
    } catch (error) {
      logger.error(`Error fetching video inference jobs: ${error}`);
      throw error;
    }
  }

  /**
   * Update inference job status
   */
  async updateJobStatus(
    id: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob | null> {
    try {
      logger.info(`Updating job ${id} status to ${status}`);

      // Check if job exists
      const existingJob = await this.inferenceJobRepository.findById(id);
      if (!existingJob) {
        throw new Error(`Inference job with ID ${id} not found`);
      }

      // Validate status transition
      if (!this.isValidStatusTransition(existingJob.status, status)) {
        throw new Error(
          `Invalid status transition from ${existingJob.status} to ${status}`,
        );
      }

      const updatedJob = await this.inferenceJobRepository.updateStatus(
        id,
        status,
      );

      logger.info(`Job status updated successfully: ${updatedJob?.status}`);
      return updatedJob;
    } catch (error) {
      logger.error(`Error updating job status: ${error}`);
      throw error;
    }
  }

  /**
   * Start processing an inference job
   */
  async startJob(id: string): Promise<InferenceJob | null> {
    try {
      logger.info(`Starting inference job: ${id}`);

      const job = await this.inferenceJobRepository.findById(id);
      if (!job) {
        throw new Error(`Inference job with ID ${id} not found`);
      }

      if (job.status !== InferenceJobStatus.PENDING) {
        throw new Error(
          `Job ${id} cannot be started. Current status: ${job.status}`,
        );
      }

      const updatedJob = await this.inferenceJobRepository.updateStatus(
        id,
        InferenceJobStatus.RUNNING,
      );

      logger.info(`Job started successfully: ${id}`);
      return updatedJob;
    } catch (error) {
      logger.error(`Error starting job: ${error}`);
      throw error;
    }
  }

  /**
   * Complete an inference job
   */
  async completeJob(
    id: string,
    carbonFootprint?: number,
  ): Promise<InferenceJob | null> {
    try {
      logger.info(`Completing inference job: ${id}`);

      const job = await this.inferenceJobRepository.findById(id);
      if (!job) {
        throw new Error(`Inference job with ID ${id} not found`);
      }

      if (job.status !== InferenceJobStatus.RUNNING) {
        throw new Error(
          `Job ${id} cannot be completed. Current status: ${job.status}`,
        );
      }

      // Update status to completed
      let updatedJob = await this.inferenceJobRepository.updateStatus(
        id,
        InferenceJobStatus.COMPLETED,
      );

      // Update carbon footprint if provided
      if (carbonFootprint !== undefined && carbonFootprint >= 0) {
        updatedJob = await this.inferenceJobRepository.updateCarbonFootprint(
          id,
          carbonFootprint,
        );
      }

      logger.info(`Job completed successfully: ${id}`);
      return updatedJob;
    } catch (error) {
      logger.error(`Error completing job: ${error}`);
      throw error;
    }
  }

  /**
   * Fail an inference job
   */
  async failJob(id: string): Promise<InferenceJob | null> {
    try {
      logger.info(`Failing inference job: ${id}`);

      const job = await this.inferenceJobRepository.findById(id);
      if (!job) {
        throw new Error(`Inference job with ID ${id} not found`);
      }

      if (job.status === InferenceJobStatus.COMPLETED) {
        throw new Error(`Job ${id} is already completed and cannot be failed`);
      }

      const updatedJob = await this.inferenceJobRepository.updateStatus(
        id,
        InferenceJobStatus.FAILED,
      );

      logger.info(`Job failed: ${id}`);
      return updatedJob;
    } catch (error) {
      logger.error(`Error failing job: ${error}`);
      throw error;
    }
  }

  /**
   * Abort an inference job
   */
  async abortJob(id: string): Promise<InferenceJob | null> {
    try {
      logger.info(`Aborting inference job: ${id}`);

      const job = await this.inferenceJobRepository.findById(id);
      if (!job) {
        throw new Error(`Inference job with ID ${id} not found`);
      }

      if (job.status === InferenceJobStatus.COMPLETED) {
        throw new Error(`Job ${id} is already completed and cannot be aborted`);
      }

      const updatedJob = await this.inferenceJobRepository.updateStatus(
        id,
        InferenceJobStatus.ABORTED,
      );

      logger.info(`Job aborted: ${id}`);
      return updatedJob;
    } catch (error) {
      logger.error(`Error aborting job: ${error}`);
      throw error;
    }
  }

  /**
   * Get jobs to process (PENDING status)
   */
  async getJobsToProcess(): Promise<InferenceJob[]> {
    try {
      logger.info("Fetching jobs to process");

      const jobs = await this.inferenceJobRepository.findJobsToProcess();

      logger.info(`Found ${jobs.length} jobs to process`);
      return jobs;
    } catch (error) {
      logger.error(`Error fetching jobs to process: ${error}`);
      throw error;
    }
  }

  /**
   * Get running jobs
   */
  async getRunningJobs(): Promise<InferenceJob[]> {
    try {
      logger.info("Fetching running jobs");

      const jobs = await this.inferenceJobRepository.findRunningJobs();

      logger.info(`Found ${jobs.length} running jobs`);
      return jobs;
    } catch (error) {
      logger.error(`Error fetching running jobs: ${error}`);
      throw error;
    }
  }

  /**
   * Get job statistics for user
   */
  async getUserJobStatistics(userId: string): Promise<{
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
    aborted: number;
    totalCarbonFootprint: number;
    averageCarbonFootprint: number;
  }> {
    try {
      logger.info(`Fetching job statistics for user: ${userId}`);

      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      const stats =
        await this.inferenceJobRepository.getJobStatisticsForUser(userId);

      // Get completed jobs to calculate carbon footprint stats
      const completedJobs =
        await this.inferenceJobRepository.findCompletedJobsByUser(userId);
      const totalCarbonFootprint = completedJobs.reduce(
        (sum, job) => sum + job.carbon_footprint,
        0,
      );
      const averageCarbonFootprint =
        completedJobs.length > 0
          ? Math.round(totalCarbonFootprint / completedJobs.length)
          : 0;

      const result = {
        ...stats,
        totalCarbonFootprint,
        averageCarbonFootprint,
      };

      logger.info(`Job statistics for user ${userId}:`, result);
      return result;
    } catch (error) {
      logger.error(`Error fetching user job statistics: ${error}`);
      throw error;
    }
  }

  /**
   * Get jobs by status
   */
  async getJobsByStatus(status: InferenceJobStatus): Promise<InferenceJob[]> {
    try {
      logger.info(`Fetching jobs with status: ${status}`);

      const jobs = await this.inferenceJobRepository.findByStatus(status);

      logger.info(`Found ${jobs.length} jobs with status ${status}`);
      return jobs;
    } catch (error) {
      logger.error(`Error fetching jobs by status: ${error}`);
      throw error;
    }
  }

  /**
   * Get jobs by date range
   */
  async getJobsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<InferenceJob[]> {
    try {
      logger.info(
        `Fetching jobs between ${startDate.toISOString()} and ${endDate.toISOString()}`,
      );

      if (startDate > endDate) {
        throw new Error("Start date must be before end date");
      }

      const jobs = await this.inferenceJobRepository.findJobsByDateRange(
        startDate,
        endDate,
      );

      logger.info(`Found ${jobs.length} jobs in date range`);
      return jobs;
    } catch (error) {
      logger.error(`Error fetching jobs by date range: ${error}`);
      throw error;
    }
  }

  /**
   * Update job carbon footprint
   */
  async updateJobCarbonFootprint(
    id: string,
    carbonFootprint: number,
  ): Promise<InferenceJob | null> {
    try {
      logger.info(
        `Updating carbon footprint for job ${id} to ${carbonFootprint}`,
      );

      if (carbonFootprint < 0) {
        throw new Error("Carbon footprint cannot be negative");
      }

      // Check if job exists
      const existingJob = await this.inferenceJobRepository.findById(id);
      if (!existingJob) {
        throw new Error(`Inference job with ID ${id} not found`);
      }

      const updatedJob =
        await this.inferenceJobRepository.updateCarbonFootprint(
          id,
          carbonFootprint,
        );

      logger.info(`Carbon footprint updated successfully for job ${id}`);
      return updatedJob;
    } catch (error) {
      logger.error(`Error updating job carbon footprint: ${error}`);
      throw error;
    }
  }

  /**
   * Get system-wide job statistics
   */
  async getSystemJobStatistics(): Promise<{
    totalJobs: number;
    jobsByStatus: Record<InferenceJobStatus, number>;
    totalCarbonFootprint: number;
    averageCarbonFootprint: number;
  }> {
    try {
      logger.info("Fetching system-wide job statistics");

      const jobsByStatus = {} as Record<InferenceJobStatus, number>;
      let totalJobs = 0;

      // Count jobs by status
      for (const status of Object.values(InferenceJobStatus)) {
        const count = await this.inferenceJobRepository.countByStatus(status);
        jobsByStatus[status] = count;
        totalJobs += count;
      }

      // Calculate carbon footprint stats from completed jobs
      const completedJobs = await this.inferenceJobRepository.findByStatus(
        InferenceJobStatus.COMPLETED,
      );
      const totalCarbonFootprint = completedJobs.reduce(
        (sum, job) => sum + job.carbon_footprint,
        0,
      );
      const averageCarbonFootprint =
        completedJobs.length > 0
          ? Math.round(totalCarbonFootprint / completedJobs.length)
          : 0;

      const stats = {
        totalJobs,
        jobsByStatus,
        totalCarbonFootprint,
        averageCarbonFootprint,
      };

      logger.info("System job statistics:", stats);
      return stats;
    } catch (error) {
      logger.error(`Error fetching system job statistics: ${error}`);
      throw error;
    }
  }

  /**
   * Validate status transition
   */
  private isValidStatusTransition(
    currentStatus: InferenceJobStatus,
    newStatus: InferenceJobStatus,
  ): boolean {
    const validTransitions: Record<InferenceJobStatus, InferenceJobStatus[]> = {
      [InferenceJobStatus.PENDING]: [
        InferenceJobStatus.RUNNING,
        InferenceJobStatus.ABORTED,
      ],
      [InferenceJobStatus.RUNNING]: [
        InferenceJobStatus.COMPLETED,
        InferenceJobStatus.FAILED,
        InferenceJobStatus.ABORTED,
      ],
      [InferenceJobStatus.COMPLETED]: [], // No transitions from completed
      [InferenceJobStatus.FAILED]: [], // No transitions from failed
      [InferenceJobStatus.ABORTED]: [], // No transitions from aborted
    };

    return validTransitions[currentStatus].includes(newStatus);
  }
}
