import { DatasetRepository } from "@/repositories/dataset.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { UserRepository } from "@/repositories/user.repository";
import { Dataset } from "@/models";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";
import { VideoAnalyzer } from "@/common/utils/video-analyzer";
import { unzipBuffer } from "@/common/utils/unzip";
import { FileSystemUtils } from "@/common/utils/file-system";
import { faker } from "@faker-js/faker";
import { INFERENCE } from "@/common/const";

import * as path from "path";
import { mkdir, writeFile, access } from "fs/promises";
import { constants } from "fs";
import { dirname } from "path";

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
   * @param videoName The name of the video.
   * @param video The video file buffer.
   * @returns The number of frames in the video.
   */
  private async calcFrameCount(
    videoName: string,
    video: Buffer,
  ): Promise<number> {
    return await VideoAnalyzer.frameCount(video, videoName);
  }

  /**
   * Adds a video to the repository.
   * @param videoName The name of the video.
   * @param video The video file buffer.
   * @param datasetId The ID of the dataset.
   * @param frame_count The number of frames in the video.
   * @returns The ID of the created video.
   */
  private async addVideoToRepo(
    userId: string,
    videoName: string,
    video: Buffer,
    datasetId: string,
    frame_count: number,
  ): Promise<string> {
    await FileSystemUtils.ensureUserDirectories(userId);

    const videoId = await this.videoRepository.create({
      dataset_id: datasetId,
      name: videoName,
      frame_count: frame_count,
    });

    const file_name = FileSystemUtils.getVideoFilePath(userId, videoId);

    await this.videoRepository.update(videoId, { file: file_name });

    try {
      logger.info("checking if file exists");
      await access(file_name, constants.F_OK);
      logger.info("file exists - throwing error");
      throw getError(ErrorEnum.FORBIDDEN_ERROR); // TODO: find another error to throw that better explains this - this should never happen anyways
    } catch {
      await writeFile(file_name, video);
      logger.info(`written video in ${file_name}`);
    }

    return videoId;
  }

  /**
   * Calculates the cost of processing a video based on the number of frames.
   * @param frame_count The number of frames in the video.
   * @returns The cost of processing the video.
   */
  private async calculateCost(frame_count: number): Promise<number> {
    const framecost = INFERENCE.COST_PER_FRAME;
    return frame_count * framecost;
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
  ): Promise<Dataset> {
    const exists = await this.datasetRepository.existsByNameAndUserId(
      datasetData.name,
      userId,
    );
    if (exists)
      throw getError(ErrorEnum.DATASET_NAME_CONFLICT_ERROR).getErrorObj();

    const datasetCreate = {
      user_id: userId,
      name: datasetData.name,
      tags: datasetData.tags || [],
    };

    const datasetId = await this.datasetRepository.create(datasetCreate);

    // Retrieves the created dataset to return it
    const createdDataset = await this.datasetRepository.findById(datasetId);
    if (!createdDataset) throw getError(ErrorEnum.GENERIC_ERROR).getErrorObj();

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
   * @param datasetId The ID of the dataset.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the dataset or null if not found.
   */
  async getDatasetById(
    datasetId: string,
    userId: string,
  ): Promise<Dataset | null> {
    return await this.datasetRepository.findByIdAndUserId(datasetId, userId);
  }

  /**
   * Updates a dataset
   * @param datasetId dataset id
   * @param userId user id
   * @param updateData name and tags to be updated
   * @returns a Promise that resolves to the updated dataset or null if not found
   */
  async updateDataset(
    datasetId: string,
    userId: string,
    updateData: { name?: string; tags?: string[] },
  ): Promise<Dataset | null> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR);

    // If updating the name, check for uniqueness
    if (updateData.name && updateData.name !== dataset.name) {
      const exists = await this.datasetRepository.existsByNameAndUserId(
        updateData.name,
        userId,
        datasetId,
      );
      if (exists) throw getError(ErrorEnum.DATASET_NAME_CONFLICT_ERROR);
    }

    const updatedDataset = await this.datasetRepository.update(
      datasetId,
      updateData,
    );
    return updatedDataset;
  }

  /**
   * Soft deletes a dataset
   * @param datasetId dataset id
   * @param userId user id
   * @returns a Promise that resolves to true if the dataset was deleted, false otherwise
   */
  async deleteDataset(datasetId: string, userId: string): Promise<boolean> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();

    return await this.datasetRepository.softDelete(datasetId);
  }

  /**
   * Uploads a video to a dataset.
   * @param datasetId The ID of the dataset.
   * @param userId The ID of the user.
   * @param content The video content.
   * @param name The name of the video.
   * @param type The type of the video.
   * @returns A Promise that resolves to the result of the upload operation.
   */
  async uploadVideo(
    datasetId: string,
    userId: string,
    content: Buffer,
    name: string,
    type: string,
  ): Promise<any> {
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();

    let cost = 0;

    if (type === "zip") {
      // const files = await unzipBuffer(content, name); // ................................................................
      const files = await decompress(content, {
        filter: (file) =>
          path.extname(file.path) == ".mp4" && !file.path.includes("__MACOSX"),
      });

      let total_frames = 0;

      // TODO: NEEDS REFACTORING AND CHECKING FOR FILETYPES !!!!!!
      for (const file in files) {
        const frame_count = await this.calcFrameCount(
          files[file].path,
          files[file].data,
        );
        total_frames = total_frames + frame_count;
      }

      cost = Math.ceil(await this.calculateCost(total_frames));

      const hasEnoughCredits = await this.userRepository.hasEnoughCredits(
        userId,
        cost,
      );
      if (!hasEnoughCredits) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
      else {
        for (const file in files) {
          const frame_count = await this.calcFrameCount(
            `${name}-${faker.string.alphanumeric(10)}`,
            files[file].data,
          );

          // TODO: Should make a constructor for this
          await this.addVideoToRepo(
            userId,
            name,
            files[file].data,
            datasetId,
            frame_count,
          );
        }

        await this.userRepository.deductCredits(userId, cost);
        logger.info(`credits deducted ${cost} from ${userId}`);

        //TODO: fix message
        return {
          message: "videos added",
          datasetId,
          costDeducted: cost,
        };
      }
    } else if (type === "video") {
      const frame_count = await this.calcFrameCount(name, content);
      cost = Math.ceil(await this.calculateCost(frame_count));

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
          datasetId,
          frame_count,
        );
        await this.userRepository.deductCredits(userId, cost);

        logger.info(`credits deducted ${cost} from ${userId}`);

        return {
          message: `${name} - ${r} - video added`,
          datasetId,
          costDeducted: cost,
        };
      }
    }
  }
}
