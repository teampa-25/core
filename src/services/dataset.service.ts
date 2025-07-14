import { DatasetRepository } from "@/repositories/dataset.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { UserRepository } from "@/repositories/user.repository";
import { Dataset } from "@/models";
import { ErrorEnum, getError } from "@/utils/api-error";
import { VideoAnalyzer } from "@/utils/video-analyzer";

export class DatasetService {
  private datasetRepository: DatasetRepository;
  private videoRepository: VideoRepository;
  private userRepository: UserRepository;

  constructor() {
    this.datasetRepository = new DatasetRepository();
    this.videoRepository = new VideoRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * Create a new dataset
   * @param userId
   * @param datasetData
   * @returns a Promise that resolves to the created dataset
   */
  async createDataset(
    userId: string,
    datasetData: {
      name: string;
      tags?: string[];
    },
  ): Promise<Dataset> {
    // Check
    const exists = await this.datasetRepository.existsByNameAndUserId(
      datasetData.name,
      userId,
    );

    if (exists) {
      throw getError(ErrorEnum.DATASET_NAME_CONFLICT_ERROR).getErrorObj();
    }

    const datasetId = await this.datasetRepository.create({
      user_id: userId,
      name: datasetData.name,
      tags: datasetData.tags || [],
    });

    // Retrieves the created dataset to return it
    const createdDataset = await this.datasetRepository.findById(datasetId);
    if (!createdDataset) {
      throw getError(ErrorEnum.GENERIC_ERROR).getErrorObj();
    }

    return createdDataset;
  }

  /**
   * Returns the list of datasets for a certain user
   * @param userId
   * @param filters filter bucket (really helpful) DO NOT REMOVE
   * @returns a Promise that resolves to an array of datasets
   */
  async getDatasets(
    userId: string,
    filters?: {
      tags?: string[];
    },
  ): Promise<Dataset[]> {
    return await this.datasetRepository.findByUserId(userId, filters);
  }

  /**
   * Returns a dataset by its ID
   * @param datasetId
   * @param userId
   * @returns a Promise that resolves to the dataset or null if not found
   */
  async getDatasetById(
    datasetId: string,
    userId?: string,
  ): Promise<Dataset | null> {
    if (userId) {
      return await this.datasetRepository.findByIdAndUserId(datasetId, userId);
    }
    return await this.datasetRepository.findById(datasetId);
  }

  /**
   * Updates a dataset
   * @param datasetId
   * @param userId
   * @param updateData
   * @returns a Promise that resolves to the updated dataset or null if not found
   */
  async updateDataset(
    datasetId: string,
    userId: string,
    updateData: {
      name?: string;
      tags?: string[];
    },
  ): Promise<Dataset | null> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
    }

    // If updating the name, check for uniqueness
    if (updateData.name && updateData.name !== dataset.name) {
      const exists = await this.datasetRepository.existsByNameAndUserId(
        updateData.name,
        userId,
        datasetId,
      );

      if (exists) {
        throw getError(ErrorEnum.DATASET_NAME_CONFLICT_ERROR).getErrorObj();
      }
    }

    const updatedDataset = await this.datasetRepository.update(
      datasetId,
      updateData,
    );
    return updatedDataset;
  }

  /**
   * Soft deletes a dataset
   * @param datasetId
   * @param userId
   * @returns a Promise that resolves to true if the dataset was deleted, false otherwise
   */
  async deleteDataset(datasetId: string, userId: string): Promise<boolean> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
    }

    return await this.datasetRepository.softDelete(datasetId);
  }

  /**
   * Adds videos to a dataset
   * @param datasetId
   * @param userId
   * @param videos Array of video files or single video file
   * @returns a Promise that resolves with the result of the operation
   */
  async addVideosToDataset(
    datasetId: string,
    userId: string,
    videos: any,
  ): Promise<any> {
    // Checks if the dataset belongs to the user ----------- authorize....
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );

    if (!dataset) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }

    // Validate input videos - what is exactly validating???
    if (!videos || (!Array.isArray(videos) && !videos.mimetype)) {
      throw getError(ErrorEnum.GENERIC_ERROR).getErrorObj();
    }
    //// -------------------------------------------------

    // Since in projects assignment there's no refs to video formats, then we assumed that those below are the supported formats
    // TODO: this should be moved to a config file or constants file
    const supportedFormats = ["video/mp4"];
    const costPerFrame = 0.001; // Defined into projects assignment
    const videoFiles = Array.isArray(videos) ? videos : [videos];

    // Filter and validate video files
    const validVideos = videoFiles.filter((file: any) => {
      if (!file.mimetype) return false;

      // Check if it's a supported video format
      if (supportedFormats.includes(file.mimetype)) {
        return true;
      }

      // Check if it's a zip file (I thinks that's better to build an utility for this - Gabs  i agree - beg)
      if (file.mimetype === "application/zip") {
        // TODO: ZIP handler
        throw getError(ErrorEnum.NOT_IMPLEMENTED_ERROR).getErrorObj();
        // return false;
      }

      return false;
    });

    if (validVideos.length === 0) {
      throw getError(ErrorEnum.GENERIC_ERROR).getErrorObj();
    }

    // NOTE: why here? we should calculate it based on how many frames will be used based on the skip frame parameter -beg
    //
    // Calculate total cost for all videos
    let totalFrames = 0;
    const processedVideos = [];

    for (const video of validVideos) {
      // Extract frame count from video using VideoAnalyzer
      const frameCount = await VideoAnalyzer.extractFrameCount(
        video.buffer,
        video.originalname || video.name,
      );
      totalFrames += frameCount;

      processedVideos.push({
        name: video.originalname || video.name,
        file: video.buffer,
        frameCount: frameCount,
        size: video.size,
      });
    }

    const totalCost = totalFrames * costPerFrame;

    // Check if user has enough credits (NOTE: to do what? to add a video???)
    const hasEnoughCredits = await this.userRepository.hasEnoughCredits(
      userId,
      totalCost,
    );
    if (!hasEnoughCredits) {
      throw getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
    }

    // Deduct credits from user
    await this.userRepository.deductCredits(userId, totalCost);

    // Save videos to dataset
    const savedVideoIds = [];
    for (const video of processedVideos) {
      try {
        const videoId = await this.videoRepository.create({
          dataset_id: datasetId,
          file: video.file,
          name: video.name,
          frame_count: video.frameCount,
        });
        savedVideoIds.push(videoId);
      } catch (error) {
        // If saving fails, rollback credits
        await this.userRepository.updateCredits(
          userId,
          (await this.userRepository.findById(userId))!.credit! + totalCost,
        );
        throw getError(ErrorEnum.GENERIC_ERROR).getErrorObj();
      }
    }

    // TODO: hey mate, this is a placeholder, actually it's late and i need to sleep, tomorrow we discuss about this
    return {
      message: "Video aggiunti con successo al dataset",
      datasetId,
      videosAdded: savedVideoIds.length,
      totalFrames,
      costDeducted: totalCost,
      videoIds: savedVideoIds,
    };
  }
}
