import { DatasetRepository } from "@/repositories/dataset.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { UserRepository } from "@/repositories/user.repository";
import { Dataset } from "@/models";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";
import { VideoAnalyzer } from "@/common/utils/video-analyzer";
import { FileSystemUtils } from "@/common/utils/file-system";
import { INFERENCE } from "@/common/const";
import * as path from "path";
import { writeFile } from "fs/promises";
import { logger } from "@/config/logger";
import decompress from "decompress";

/**
 * Service for managing datasets, including creation, retrieval, updating, and deletion.
 * It also handles video uploads and calculates costs associated with dataset operations.
 */
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
   * Calculates the number of frames in a video.
   * @param video The video file buffer.
   * @param videoName The name of the video.
   * @returns The number of frames in the video.
   */
  private async calcFrameCount(
    video: Buffer,
    videoName: string,
  ): Promise<number> {
    return await VideoAnalyzer.frameCount(video, videoName);
  }

  /**
   * Adds a video to the repository.
   * @param userId User ID
   * @param videoName Video name
   * @param video Video buffer
   * @param datasetId Dataset ID
   * @param frameCount Frame count
   * @returns Video ID
   */
  private async addVideoToRepo(
    userId: string,
    videoName: string,
    video: Buffer,
    datasetId: string,
    frameCount: number,
  ): Promise<string> {
    //create directories and DB entry in parallel
    const [videoId] = await Promise.all([
      this.videoRepository.create({
        datasetId,
        name: videoName,
        frameCount,
      }),
      FileSystemUtils.ensureUserDirectories(userId),
    ]);

    const filePath = FileSystemUtils.getVideoFilePath(userId, videoId);

    await this.videoRepository.update(videoId, { file: filePath });

    const exists = FileSystemUtils.fileExists(filePath);
    if (exists) {
      throw getError(ErrorEnum.CONFLICT_ERROR);
    }

    await writeFile(filePath, video);

    return videoId;
  }

  /**
   * Calculates the cost of processing a video based on the number of frames.
   * @param frameCount The number of frames in the video.
   * @returns The cost of processing the video.
   */
  private calculateCost(frameCount: number): number {
    return frameCount * INFERENCE.COST_PER_FRAME;
  }

  /**
   * Creates a new dataset for a user.
   * @param userId The ID of the user.
   * @param datasetData The data for the new dataset.
   * @returns The created dataset.
   */
  async createDataset(
    userId: string,
    datasetData: { name: string; tags?: string[] },
  ): Promise<Dataset | ErrorEnum> {
    const exists = await this.datasetRepository.existsByNameAndUserId(
      datasetData.name,
      userId,
    );

    if (exists) throw getError(ErrorEnum.DATASET_NAME_CONFLICT_ERROR);

    const datasetCreate = {
      userId: userId,
      name: datasetData.name,
      tags: datasetData.tags || [],
    };

    const id = await this.datasetRepository.create(datasetCreate);

    // Retrieves the created dataset to return it
    const createdDataset = await this.datasetRepository.findById(id);

    if (!createdDataset) throw getError(ErrorEnum.GENERIC_ERROR);

    return createdDataset;
  }

  /**
   * Retrieves the list of datasets for a certain user.
   * @param userId The ID of the user.
   * @param filters Optional filters to apply when retrieving datasets.
   * @returns A Promise that resolves to an array of datasets.
   */
  async getDatasets(
    userId: string,
    filters?: { tags?: string[] },
  ): Promise<Dataset[]> {
    return await this.datasetRepository.findByUserId(userId, filters);
  }

  /**
   * Retrieves a dataset by its ID.
   * @param id The ID of the dataset.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the dataset or null if not found.
   */
  async getDatasetById(id: string, userId: string): Promise<Dataset> {
    const dataset = await this.datasetRepository.findByIdAndUserId(id, userId);

    if (!dataset) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }

    return dataset;
  }

  /**
   * Updates a dataset
   * @param id dataset id
   * @param userId user id
   * @param updateData name and tags to be updated
   * @returns a Promise that resolves to the updated dataset or null if not found
   */
  async updateDataset(
    id: string,
    userId: string,
    updateData: { name?: string; tags?: string[] },
  ): Promise<Dataset | null> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(id, userId);
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR);

    // If updating the name, check for uniqueness
    if (updateData.name && updateData.name !== dataset.name) {
      const exists = await this.datasetRepository.existsByNameAndUserId(
        updateData.name,
        userId,
        id,
      );
      if (exists) throw getError(ErrorEnum.DATASET_NAME_CONFLICT_ERROR);
    }

    const updatedDataset = await this.datasetRepository.update(id, updateData);
    return updatedDataset;
  }

  /**
   * Soft deletes a dataset
   * @param id dataset id
   * @param userId user id
   * @returns a Promise that resolves to true if the dataset was deleted, false otherwise
   */
  async deleteDataset(id: string, userId: string): Promise<boolean> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(id, userId);
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR);

    return await this.datasetRepository.softDelete(id);
  }

  /**
   * Uploads a video to a dataset.
   * @param id The ID of the dataset.
   * @param userId The ID of the user.
   * @param content The video content.
   * @param name The name of the video.
   * @param type The type of the video.
   * @returns A Promise that resolves to the result of the upload operation.
   */
  async uploadVideo(
    id: string,
    userId: string,
    content: Buffer,
    name: string,
    type: string,
  ): Promise<{ message: string; id: string; costDeducted: number }> {
    const dataset = await this.datasetRepository.findByIdAndUserId(id, userId);
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR);

    let cost = 0;
    let videoIds: string[] = [];

    try {
      if (type === "zip") {
        const files = await decompress(content, {
          filter: (file) =>
            path.extname(file.path) === ".mp4" &&
            !file.path.includes("__MACOSX"),
        });

        if (files.length === 0) throw getError(ErrorEnum.BAD_REQUEST_ERROR);

        // Calculate total frames in one pass
        const frameCountPromises = files.map((file) =>
          this.calcFrameCount(file.data, file.path),
        );
        const frameCounts = await Promise.all(frameCountPromises);
        const totalFrames = frameCounts.reduce((sum, count) => sum + count, 0);
        cost = Math.ceil(this.calculateCost(totalFrames));

        // Check credits before processing
        if (!(await this.userRepository.hasEnoughCredits(userId, cost))) {
          throw getError(ErrorEnum.INSUFFICIENT_CREDIT);
        }

        // Process all files
        const uploadPromises = files.map(async (file, index) => {
          return this.addVideoToRepo(
            userId,
            `${name}-${index + 1}`,
            file.data,
            id,
            frameCounts[index],
          );
        });

        videoIds = await Promise.all(uploadPromises);
        await this.userRepository.deductCredits(userId, cost);
      } else if (type === "video") {
        const frameCount = await this.calcFrameCount(content, name);
        cost = Math.ceil(this.calculateCost(frameCount));

        if (!(await this.userRepository.hasEnoughCredits(userId, cost))) {
          throw getError(ErrorEnum.INSUFFICIENT_CREDIT);
        }

        await this.addVideoToRepo(userId, name, content, id, frameCount);
        await this.userRepository.deductCredits(userId, cost);
      } else {
        throw getError(ErrorEnum.BAD_REQUEST_ERROR);
      }

      return {
        message:
          videoIds.length > 1
            ? `${videoIds.length} videos added`
            : `${name} added`,
        id,
        costDeducted: cost,
      };
    } catch (error) {
      logger.error(`Error uploading video: ${error}`);
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }
}
