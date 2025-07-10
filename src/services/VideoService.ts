import { Video } from "../database/models/Video";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { IVideoRepository } from "../repositories/interfaces/IVideoRepository";
import { logger } from "../config/logger";

/**
 * Video Service
 * Business logic layer for video operations
 */
export class VideoService {
  private videoRepository: IVideoRepository;

  constructor() {
    this.videoRepository = RepositoryFactory.createVideoRepository();
  }

  /**
   * Create a new video
   */
  async createVideo(videoData: {
    dataset_id: string;
    file: Buffer;
    name: string;
    frame_count: number;
  }): Promise<Video> {
    try {
      logger.info(
        `Creating new video: ${videoData.name} for dataset ${videoData.dataset_id}`,
      );

      // Business logic validation
      if (!videoData.dataset_id || videoData.dataset_id.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      if (!videoData.name || videoData.name.trim().length === 0) {
        throw new Error("Video name is required");
      }

      if (!videoData.file || videoData.file.length === 0) {
        throw new Error("Video file is required");
      }

      if (!videoData.frame_count || videoData.frame_count <= 0) {
        throw new Error("Frame count must be a positive number");
      }

      // Check if video name already exists in the dataset
      const existingVideo = await this.videoRepository.findByDatasetAndName(
        videoData.dataset_id,
        videoData.name,
      );

      if (existingVideo) {
        throw new Error(
          `Video with name "${videoData.name}" already exists in this dataset`,
        );
      }

      // Create the video
      const newVideo = await this.videoRepository.create({
        dataset_id: videoData.dataset_id,
        file: videoData.file,
        name: videoData.name.trim(),
        frame_count: videoData.frame_count,
      } as any);

      logger.info(`Video created successfully with ID: ${newVideo.id}`);
      return newVideo;
    } catch (error) {
      logger.error(`Error creating video: ${error}`);
      throw error;
    }
  }

  /**
   * Get video by ID
   */
  async getVideoById(id: string): Promise<Video | null> {
    try {
      logger.info(`Fetching video with ID: ${id}`);

      if (!id || id.trim().length === 0) {
        throw new Error("Video ID is required");
      }

      const video = await this.videoRepository.findById(id);

      if (!video) {
        logger.warn(`Video with ID ${id} not found`);
        return null;
      }

      logger.info(`Video found: ${video.name}`);
      return video;
    } catch (error) {
      logger.error(`Error fetching video by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Get videos by dataset ID
   */
  async getVideosByDataset(
    datasetId: string,
    filters?: {
      minFrames?: number;
      maxFrames?: number;
    },
  ): Promise<Video[]> {
    try {
      logger.info(`Fetching videos for dataset: ${datasetId}`);

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      let videos: Video[];

      if (
        filters?.minFrames !== undefined ||
        filters?.maxFrames !== undefined
      ) {
        videos = await this.videoRepository.findByDatasetWithFrameFilter(
          datasetId,
          filters.minFrames,
          filters.maxFrames,
        );
      } else {
        videos = await this.videoRepository.findByDatasetId(datasetId);
      }

      logger.info(`Found ${videos.length} videos for dataset ${datasetId}`);
      return videos;
    } catch (error) {
      logger.error(`Error fetching videos by dataset: ${error}`);
      throw error;
    }
  }

  /**
   * Update video information
   */
  async updateVideo(
    id: string,
    updateData: {
      name?: string;
      frame_count?: number;
    },
  ): Promise<Video | null> {
    try {
      logger.info(`Updating video with ID: ${id}`);

      // Check if video exists
      const existingVideo = await this.videoRepository.findById(id);
      if (!existingVideo) {
        throw new Error(`Video with ID ${id} not found`);
      }

      // Validate name if provided
      if (updateData.name !== undefined) {
        if (!updateData.name || updateData.name.trim().length === 0) {
          throw new Error("Video name cannot be empty");
        }

        // Check if another video with same name exists in the dataset
        const videoWithSameName =
          await this.videoRepository.findByDatasetAndName(
            existingVideo.dataset_id,
            updateData.name,
          );

        if (videoWithSameName && videoWithSameName.id !== id) {
          throw new Error(
            `Video with name "${updateData.name}" already exists in this dataset`,
          );
        }

        updateData.name = updateData.name.trim();
      }

      // Validate frame count if provided
      if (updateData.frame_count !== undefined && updateData.frame_count <= 0) {
        throw new Error("Frame count must be a positive number");
      }

      // Prepare update data
      const updatePayload = { ...updateData };

      // Remove undefined values
      Object.keys(updatePayload).forEach((key) => {
        if (updatePayload[key as keyof typeof updatePayload] === undefined) {
          delete updatePayload[key as keyof typeof updatePayload];
        }
      });

      const updatedVideo = await this.videoRepository.update(id, updatePayload);

      logger.info(`Video updated successfully: ${updatedVideo?.name}`);
      return updatedVideo;
    } catch (error) {
      logger.error(`Error updating video: ${error}`);
      throw error;
    }
  }

  /**
   * Update video frame count only
   */
  async updateVideoFrameCount(
    id: string,
    frameCount: number,
  ): Promise<Video | null> {
    try {
      logger.info(`Updating frame count for video ${id} to ${frameCount}`);

      if (frameCount <= 0) {
        throw new Error("Frame count must be a positive number");
      }

      // Check if video exists
      const existingVideo = await this.videoRepository.findById(id);
      if (!existingVideo) {
        throw new Error(`Video with ID ${id} not found`);
      }

      const updatedVideo = await this.videoRepository.updateFrameCount(
        id,
        frameCount,
      );

      logger.info(
        `Video frame count updated successfully: ${updatedVideo?.name}, frames: ${frameCount}`,
      );
      return updatedVideo;
    } catch (error) {
      logger.error(`Error updating video frame count: ${error}`);
      throw error;
    }
  }

  /**
   * Delete video
   */
  async deleteVideo(id: string): Promise<boolean> {
    try {
      logger.info(`Deleting video with ID: ${id}`);

      // Check if video exists
      const existingVideo = await this.videoRepository.findById(id);
      if (!existingVideo) {
        throw new Error(`Video with ID ${id} not found`);
      }

      const deleted = await this.videoRepository.delete(id);

      if (deleted) {
        logger.info(`Video with ID ${id} deleted successfully`);
      } else {
        logger.warn(`Failed to delete video with ID ${id}`);
      }

      return deleted;
    } catch (error) {
      logger.error(`Error deleting video: ${error}`);
      throw error;
    }
  }

  /**
   * Get videos by frame count range
   */
  async getVideosByFrameRange(
    minFrames: number,
    maxFrames: number,
  ): Promise<Video[]> {
    try {
      logger.info(
        `Fetching videos with frame count between ${minFrames} and ${maxFrames}`,
      );

      if (minFrames < 0 || maxFrames < 0) {
        throw new Error("Frame counts cannot be negative");
      }

      if (minFrames > maxFrames) {
        throw new Error("Minimum frame count cannot be greater than maximum");
      }

      const videos = await this.videoRepository.findByFrameCountRange(
        minFrames,
        maxFrames,
      );

      logger.info(
        `Found ${videos.length} videos in frame range ${minFrames}-${maxFrames}`,
      );
      return videos;
    } catch (error) {
      logger.error(`Error fetching videos by frame range: ${error}`);
      throw error;
    }
  }

  /**
   * Get total frame count for a dataset
   */
  async getDatasetTotalFrames(datasetId: string): Promise<number> {
    try {
      logger.info(`Calculating total frame count for dataset: ${datasetId}`);

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      const totalFrames =
        await this.videoRepository.getTotalFrameCountForDataset(datasetId);

      logger.info(`Total frame count for dataset ${datasetId}: ${totalFrames}`);
      return totalFrames;
    } catch (error) {
      logger.error(`Error calculating dataset total frames: ${error}`);
      throw error;
    }
  }

  /**
   * Get video count for a dataset
   */
  async getDatasetVideoCount(datasetId: string): Promise<number> {
    try {
      logger.info(`Counting videos for dataset: ${datasetId}`);

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      const videoCount =
        await this.videoRepository.getVideoCountForDataset(datasetId);

      logger.info(`Video count for dataset ${datasetId}: ${videoCount}`);
      return videoCount;
    } catch (error) {
      logger.error(`Error counting dataset videos: ${error}`);
      throw error;
    }
  }

  /**
   * Check if video name exists in dataset
   */
  async checkVideoNameInDataset(
    datasetId: string,
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    try {
      logger.info(
        `Checking if video name "${name}" exists in dataset ${datasetId}`,
      );

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      if (!name || name.trim().length === 0) {
        throw new Error("Video name is required");
      }

      const exists = await this.videoRepository.nameExistsInDataset(
        datasetId,
        name.trim(),
        excludeId,
      );

      logger.info(
        `Video name "${name}" exists in dataset ${datasetId}: ${exists}`,
      );
      return exists;
    } catch (error) {
      logger.error(`Error checking video name existence: ${error}`);
      throw error;
    }
  }

  /**
   * Delete all videos for a dataset
   */
  async deleteAllVideosForDataset(datasetId: string): Promise<boolean> {
    try {
      logger.info(`Deleting all videos for dataset: ${datasetId}`);

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      const deleted = await this.videoRepository.deleteAllForDataset(datasetId);

      if (deleted) {
        logger.info(`All videos deleted successfully for dataset ${datasetId}`);
      } else {
        logger.warn(`Failed to delete videos for dataset ${datasetId}`);
      }

      return deleted;
    } catch (error) {
      logger.error(`Error deleting all videos for dataset: ${error}`);
      throw error;
    }
  }

  /**
   * Get video statistics for dataset
   */
  async getVideoStatsForDataset(datasetId: string): Promise<{
    videoCount: number;
    totalFrames: number;
    averageFrames: number;
    minFrames: number;
    maxFrames: number;
  }> {
    try {
      logger.info(`Fetching video statistics for dataset: ${datasetId}`);

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      const videos = await this.videoRepository.findByDatasetId(datasetId);

      if (videos.length === 0) {
        return {
          videoCount: 0,
          totalFrames: 0,
          averageFrames: 0,
          minFrames: 0,
          maxFrames: 0,
        };
      }

      const videoCount = videos.length;
      const totalFrames = videos.reduce(
        (sum, video) => sum + video.frame_count,
        0,
      );
      const averageFrames = Math.round(totalFrames / videoCount);
      const minFrames = Math.min(...videos.map((video) => video.frame_count));
      const maxFrames = Math.max(...videos.map((video) => video.frame_count));

      const stats = {
        videoCount,
        totalFrames,
        averageFrames,
        minFrames,
        maxFrames,
      };

      logger.info(`Video statistics for dataset ${datasetId}:`, stats);
      return stats;
    } catch (error) {
      logger.error(`Error fetching video statistics: ${error}`);
      throw error;
    }
  }

  /**
   * Bulk upload videos to dataset
   */
  async bulkUploadVideos(
    datasetId: string,
    videos: Array<{
      file: Buffer;
      name: string;
      frame_count: number;
    }>,
  ): Promise<{
    success: Video[];
    failed: Array<{ name: string; error: string }>;
  }> {
    try {
      logger.info(
        `Bulk uploading ${videos.length} videos to dataset ${datasetId}`,
      );

      if (!datasetId || datasetId.trim().length === 0) {
        throw new Error("Dataset ID is required");
      }

      if (!videos || videos.length === 0) {
        throw new Error("No videos provided for upload");
      }

      const results = {
        success: [] as Video[],
        failed: [] as Array<{ name: string; error: string }>,
      };

      for (const videoData of videos) {
        try {
          const video = await this.createVideo({
            dataset_id: datasetId,
            file: videoData.file,
            name: videoData.name,
            frame_count: videoData.frame_count,
          });

          results.success.push(video);
        } catch (error) {
          results.failed.push({
            name: videoData.name,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      logger.info(
        `Bulk upload completed: ${results.success.length} success, ${results.failed.length} failed`,
      );
      return results;
    } catch (error) {
      logger.error(`Error in bulk video upload: ${error}`);
      throw error;
    }
  }
}
