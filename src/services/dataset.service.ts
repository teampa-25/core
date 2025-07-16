import { DatasetRepository } from "@/repositories/dataset.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { UserRepository } from "@/repositories/user.repository";
import { Dataset } from "@/models";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";
import { VideoAnalyzer } from "@/common/utils/video-analyzer";
import { faker } from "@faker-js/faker";
import { INFERENCE } from "@/common/const";

import * as path from "path";
import { mkdir, writeFile, access } from "fs/promises";
import { constants } from "fs";

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
   * Ensures that the user's video and results directories exist.
   * Creates them if they do not exist.
   * @param userId The ID of the user.
   * @returns True if the directories are successfully created or already exist, false otherwise.
   */
  private async checkUserDirectory(userId: string) {
    try {
      const videos = `/files/${userId}/videos`;
      const results = `/files/${userId}/results`;

      await mkdir(videos, { recursive: true });
      await mkdir(results, { recursive: true });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Adds a video to the repository.
   * @param userId The ID of the user.
   * @param videoName The name of the video.
   * @param video The video file buffer.
   * @param id The ID of the dataset.
   * @param frameCount The number of frames in the video.
   * @returns The ID of the created video.
   */
  private async addVideoToRepo(
    userId: string,
    videoName: string,
    video: Buffer,
    id: string,
    frameCount: number,
  ): Promise<string> {
    await this.checkUserDirectory(userId);

    const videoId = await this.videoRepository.create({
      datasetId: id,
      name: videoName,
      frameCount: frameCount,
    });

    const fileName = `/files/${userId}/videos/${videoId}.mp4`;

    await this.videoRepository.update(videoId, { file: fileName });

    try {
      logger.info("checking if file exists");
      await access(fileName, constants.F_OK);
      logger.info("file exists - throwing error");
      throw getError(ErrorEnum.FORBIDDEN_ERROR); // TODO: find another error to throw that better explains this - this should never happen anyways
    } catch {
      await writeFile(fileName, video);
      logger.info(`written video in ${fileName}`);
    }

    return videoId;
  }

  private async saveToFile(video: Buffer, path: string) {}

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
  ): Promise<any> {
    // const supportedFormats = ["video/mp4"]; // better somewhere else, i think -beg
    const dataset = await this.datasetRepository.findByIdAndUserId(id, userId);
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR);

    let cost = 0;

    if (type === "zip") {
      // const files = await unzipBuffer(content, name); // ................................................................
      const files = await decompress(content, {
        filter: (file) =>
          path.extname(file.path) == ".mp4" && !file.path.includes("__MACOSX"),
      });

      let totalFrames = 0;

      // TODO: NEEEDS REFACTORING AND CHECKING FOR FILETYPES !!!!!!
      for (const file in files) {
        const frameCount = await this.calcFrameCount(
          files[file].data,
          files[file].path,
        );
        totalFrames = totalFrames + frameCount;
      }

      cost = Math.ceil(this.calculateCost(totalFrames));

      const hasEnoughCredits = await this.userRepository.hasEnoughCredits(
        userId,
        cost,
      );
      if (!hasEnoughCredits) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
      else {
        for (const file in files) {
          const frameCount = await this.calcFrameCount(
            files[file].data,
            `${name}-${faker.string.alphanumeric(10)}`,
          );

          // TODO: Should make a constructor for this
          await this.addVideoToRepo(
            userId,
            name,
            files[file].data,
            id,
            frameCount,
          );
        }

        await this.userRepository.deductCredits(userId, cost);
        logger.info(`credits deducted ${cost} from ${userId}`);

        //TODO: fix message
        return {
          message: "videos added",
          id,
          costDeducted: cost,
        };
      }
    } else if (type === "video") {
      const frameCount = await this.calcFrameCount(content, name);
      cost = Math.ceil(this.calculateCost(frameCount));

      const hasEnoughCredits = await this.userRepository.hasEnoughCredits(
        userId,
        cost,
      );

      if (!hasEnoughCredits) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
      else {
        const r = await this.addVideoToRepo(
          userId,
          name,
          content,
          id,
          frameCount,
        );
        await this.userRepository.deductCredits(userId, cost);

        logger.info(`credits deducted ${cost} from ${userId}`);

        return {
          message: `${name} - ${r} - video added`,
          id,
          costDeducted: cost,
        };
      }
    }
  }
}
