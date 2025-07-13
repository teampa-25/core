import { Video } from "@/models/video";
import { SequelizeBaseDAO } from "@/dao/base/squelize.base.dao";
import { Op, InferAttributes, InferCreationAttributes } from "sequelize";

// helpers for better type safety and consistency
export type VideoCreateAttributes = InferCreationAttributes<Video>;
export type VideoUpdateAttributes = Partial<InferAttributes<Video>>;

/**
 * Video DAO class for database operations
 * Extends the base DAO with Video-specific methods
 */
export class VideoDAO extends SequelizeBaseDAO<
  Video,
  VideoCreateAttributes,
  VideoUpdateAttributes
> {
  constructor() {
    super(Video);
  }

  /**
   * Find videos by dataset ID
   * @param datasetId - The dataset ID to search for
   * @returns Promise of array of videos
   */
  async findByDatasetId(datasetId: string): Promise<Video[]> {
    try {
      return await this.findBy({ dataset_id: datasetId });
    } catch (error) {
      throw new Error(
        `Error finding videos for dataset ${datasetId}: ${error}`,
      );
    }
  }

  /**
   * Find video by dataset and name
   * @param datasetId - The dataset ID
   * @param name - The video name
   * @returns Promise of the video or null if not found
   */
  async findByDatasetAndName(
    datasetId: string,
    name: string,
  ): Promise<Video | null> {
    try {
      return await this.findOneBy({ dataset_id: datasetId, name });
    } catch (error) {
      throw new Error(
        `Error finding video by dataset ${datasetId} and name ${name}: ${error}`,
      );
    }
  }

  /**
   * Get total frame count for a dataset
   * @param datasetId - The dataset ID
   * @returns Promise of total frame count
   */
  async getTotalFrameCountByDataset(datasetId: string): Promise<number> {
    try {
      const videos = await this.findByDatasetId(datasetId);
      return videos.reduce((total, video) => total + video.frame_count, 0);
    } catch (error) {
      throw new Error(
        `Error calculating total frame count for dataset ${datasetId}: ${error}`,
      );
    }
  }

  /**
   * Find videos with frame count greater than threshold
   * @param threshold - Minimum frame count
   * @returns Promise of array of videos
   */
  async findVideosWithFrameCountAbove(threshold: number): Promise<Video[]> {
    try {
      return (await this.model.findAll({
        where: {
          frame_count: {
            [Op.gt]: threshold,
          },
        },
      })) as Video[];
    } catch (error) {
      throw new Error(
        `Error finding videos with frame count above ${threshold}: ${error}`,
      );
    }
  }

  /**
   * Calculate cost for video upload (0.001 token per frame)
   * @param frameCount - Number of frames in the video
   * @returns Cost in tokens
   */
  calculateUploadCost(frameCount: number): number {
    return frameCount * 0.001;
  }

  /**
   * Calculate cost for all videos in a dataset
   * @param datasetId - The dataset ID
   * @returns Promise of total upload cost
   */
  async calculateDatasetUploadCost(datasetId: string): Promise<number> {
    try {
      const totalFrames = await this.getTotalFrameCountByDataset(datasetId);
      return this.calculateUploadCost(totalFrames);
    } catch (error) {
      throw new Error(
        `Error calculating upload cost for dataset ${datasetId}: ${error}`,
      );
    }
  }

  /**
   * Get video statistics for a dataset
   * @param datasetId - The dataset ID
   * @returns Promise of video statistics
   */
  async getDatasetVideoStats(datasetId: string): Promise<{
    totalVideos: number;
    totalFrames: number;
    totalUploadCost: number;
    averageFramesPerVideo: number;
  }> {
    try {
      const videos = await this.findByDatasetId(datasetId);
      const totalVideos = videos.length;
      const totalFrames = videos.reduce(
        (total, video) => total + video.frame_count,
        0,
      );
      const totalUploadCost = this.calculateUploadCost(totalFrames);
      const averageFramesPerVideo =
        totalVideos > 0 ? totalFrames / totalVideos : 0;

      return {
        totalVideos,
        totalFrames,
        totalUploadCost,
        averageFramesPerVideo,
      };
    } catch (error) {
      throw new Error(
        `Error getting video stats for dataset ${datasetId}: ${error}`,
      );
    }
  }

  /**
   * Update video file and frame count
   * @param id - Video ID
   * @param file - New file buffer
   * @param frameCount - New frame count
   * @returns Promise of the updated video or null if not found
   */
  async updateVideoFile(
    id: string,
    file: Buffer,
    frameCount: number,
  ): Promise<Video | null> {
    try {
      return await this.model
        .update(
          { file, frame_count: frameCount },
          {
            where: { id },
            returning: true,
          },
        )
        .then(([updatedCount]) => {
          if (updatedCount === 0) return null;
          return this.findById(id);
        });
    } catch (error) {
      throw new Error(`Error updating video file for ${id}: ${error}`);
    }
  }

  /**
   * Check if video name exists in dataset
   * @param datasetId - The dataset ID
   * @param name - The video name
   * @param excludeId - Optional ID to exclude from check (for updates)
   * @returns Promise of boolean indicating if name exists
   */
  async nameExistsInDataset(
    datasetId: string,
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    try {
      const whereClause: any = {
        dataset_id: datasetId,
        name,
      };

      if (excludeId) {
        whereClause.id = {
          [Op.ne]: excludeId,
        };
      }

      const count = await this.count(whereClause);
      return count > 0;
    } catch (error) {
      throw new Error(
        `Error checking if video name exists in dataset: ${error}`,
      );
    }
  }
}
