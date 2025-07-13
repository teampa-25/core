import { InferenceJobStatus } from "@/models/enums";
import { InferenceJob } from "@/models/inference.job";
import { SequelizeBaseDAO } from "@/dao-bak/base/sequelize.base.dao";
import { Op, InferAttributes, InferCreationAttributes } from "sequelize";

// helpers for better type safety and consistency
export type InferenceJobCreateAttributes =
  InferCreationAttributes<InferenceJob>;
export type InferenceJobUpdateAttributes = Partial<
  InferAttributes<InferenceJob>
>;

/**
 * InferenceJob DAO class for database operations
 * Extends the base DAO with InferenceJob-specific methods
 */
export class InferenceJobDAO extends SequelizeBaseDAO<
  InferenceJob,
  InferenceJobCreateAttributes,
  InferenceJobUpdateAttributes
> {
  constructor() {
    super(InferenceJob);
  }

  /**
   * Find inference jobs by user ID
   * @param userId - The user ID to search for
   * @returns Promise of array of inference jobs
   */
  async findByUserId(userId: string): Promise<InferenceJob[]> {
    try {
      return await this.findBy({ user_id: userId });
    } catch (error) {
      throw new Error(
        `Error finding inference jobs for user ${userId}: ${error}`,
      );
    }
  }

  /**
   * Find inference jobs by dataset ID
   * @param datasetId - The dataset ID to search for
   * @returns Promise of array of inference jobs
   */
  async findByDatasetId(datasetId: string): Promise<InferenceJob[]> {
    try {
      return await this.findBy({ dataset_id: datasetId });
    } catch (error) {
      throw new Error(
        `Error finding inference jobs for dataset ${datasetId}: ${error}`,
      );
    }
  }

  /**
   * Find inference jobs by status
   * @param status - The status to search for
   * @returns Promise of array of inference jobs
   */
  async findByStatus(status: InferenceJobStatus): Promise<InferenceJob[]> {
    try {
      return await this.findBy({ status });
    } catch (error) {
      throw new Error(
        `Error finding inference jobs by status ${status}: ${error}`,
      );
    }
  }

  /**
   * Find pending jobs in queue order
   * @returns Promise of array of pending inference jobs ordered by creation date
   */
  async findPendingJobs(): Promise<InferenceJob[]> {
    try {
      return (await this.model.findAll({
        where: { status: InferenceJobStatus.PENDING },
        order: [["created_at", "ASC"]],
      })) as InferenceJob[];
    } catch (error) {
      throw new Error(`Error finding pending inference jobs: ${error}`);
    }
  }

  /**
   * Find running jobs
   * @returns Promise of array of running inference jobs
   */
  async findRunningJobs(): Promise<InferenceJob[]> {
    try {
      return await this.findBy({ status: InferenceJobStatus.RUNNING });
    } catch (error) {
      throw new Error(`Error finding running inference jobs: ${error}`);
    }
  }

  /**
   * Find completed jobs by user
   * @param userId - The user ID
   * @returns Promise of array of completed inference jobs
   */
  async findCompletedJobsByUser(userId: string): Promise<InferenceJob[]> {
    try {
      return (await this.model.findAll({
        where: {
          user_id: userId,
          status: InferenceJobStatus.COMPLETED,
        },
        order: [["updated_at", "DESC"]],
      })) as InferenceJob[];
    } catch (error) {
      throw new Error(
        `Error finding completed jobs for user ${userId}: ${error}`,
      );
    }
  }

  /**
   * Update job status
   * @param id - Job ID
   * @param status - New status
   * @returns Promise of the updated job or null if not found
   */
  async updateStatus(
    id: string,
    status: InferenceJobStatus,
  ): Promise<InferenceJob | null> {
    try {
      return await this.update(id, { status, updated_at: new Date() });
    } catch (error) {
      throw new Error(`Error updating status for job ${id}: ${error}`);
    }
  }

  /**
   * Update carbon footprint
   * @param id - Job ID
   * @param carbonFootprint - Carbon footprint value
   * @returns Promise of the updated job or null if not found
   */
  async updateCarbonFootprint(
    id: string,
    carbonFootprint: number,
  ): Promise<InferenceJob | null> {
    try {
      return await this.update(id, {
        carbon_footprint: carbonFootprint,
        updated_at: new Date(),
      });
    } catch (error) {
      throw new Error(
        `Error updating carbon footprint for job ${id}: ${error}`,
      );
    }
  }

  /**
   * Get job statistics for a user
   * @param userId - The user ID
   * @returns Promise of job statistics
   */
  async getUserJobStats(userId: string): Promise<{
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
    aborted: number;
    totalCarbonFootprint: number;
  }> {
    try {
      const jobs = await this.findByUserId(userId);

      const stats = {
        total: jobs.length,
        pending: 0,
        running: 0,
        completed: 0,
        failed: 0,
        aborted: 0,
        totalCarbonFootprint: 0,
      };

      jobs.forEach((job) => {
        stats.totalCarbonFootprint += job.carbon_footprint;

        switch (job.status) {
          case InferenceJobStatus.PENDING:
            stats.pending++;
            break;
          case InferenceJobStatus.RUNNING:
            stats.running++;
            break;
          case InferenceJobStatus.COMPLETED:
            stats.completed++;
            break;
          case InferenceJobStatus.FAILED:
            stats.failed++;
            break;
          case InferenceJobStatus.ABORTED:
            stats.aborted++;
            break;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Error getting job stats for user ${userId}: ${error}`);
    }
  }

  /**
   * Calculate inference cost (0.002 token per image)
   * @param imageCount - Number of images to process
   * @returns Cost in tokens
   */
  calculateInferenceCost(imageCount: number): number {
    return imageCount * 0.002;
  }

  /**
   * Find jobs created within date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise of array of inference jobs
   */
  async findJobsInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<InferenceJob[]> {
    try {
      return (await this.model.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["created_at", "DESC"]],
      })) as InferenceJob[];
    } catch (error) {
      throw new Error(`Error finding jobs in date range: ${error}`);
    }
  }

  /**
   * Get total carbon footprint for a user
   * @param userId - The user ID
   * @returns Promise of total carbon footprint
   */
  async getTotalCarbonFootprintByUser(userId: string): Promise<number> {
    try {
      const jobs = await this.findByUserId(userId);
      return jobs.reduce((total, job) => total + job.carbon_footprint, 0);
    } catch (error) {
      throw new Error(
        `Error calculating total carbon footprint for user ${userId}: ${error}`,
      );
    }
  }

  /**
   * Find failed jobs with retry potential
   * @param userId - Optional user ID to filter by
   * @returns Promise of array of failed inference jobs
   */
  async findFailedJobsForRetry(userId?: string): Promise<InferenceJob[]> {
    try {
      const whereClause: any = {
        status: InferenceJobStatus.FAILED,
      };

      if (userId) {
        whereClause.user_id = userId;
      }

      return (await this.model.findAll({
        where: whereClause,
        order: [["updated_at", "DESC"]],
      })) as InferenceJob[];
    } catch (error) {
      throw new Error(`Error finding failed jobs for retry: ${error}`);
    }
  }

  /**
   * Count active jobs (PENDING or RUNNING) for load balancing
   * @returns Promise of count of active jobs
   */
  async countActiveJobs(): Promise<number> {
    try {
      return await this.model.count({
        where: {
          status: {
            [Op.in]: [InferenceJobStatus.PENDING, InferenceJobStatus.RUNNING],
          },
        },
      });
    } catch (error) {
      throw new Error(`Error counting active jobs: ${error}`);
    }
  }
}
