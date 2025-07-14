import { DatasetRepository } from "@/repositories/dataset.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { UserRepository } from "@/repositories/user.repository";
import { Dataset } from "@/models/dataset";
import { ErrorEnum, getError } from "@/utils/api.error";
import { VideoAnalyzer } from "@/utils/video.analyzer";
import { unzipBuffer } from "@/utils/unzip";
import { faker } from "@faker-js/faker/.";
import { File } from "decompress";

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
   * extract frame count from video
   */
  private async calcFreameCount(
    videoName: string,
    video: Buffer,
  ): Promise<number> {
    return await VideoAnalyzer.extractFrameCount(video, videoName);
  }

  /**
   * add video to repo
   */
  private async addVideoToRepo(
    videoName: string,
    video: Buffer,
    datasetId: string,
    frame_count: number,
  ): Promise<string> {
    const videoId = await this.videoRepository.create({
      dataset_id: datasetId,
      name: videoName,
      file: video,
      frame_count: frame_count,
    });

    return videoId;
  }

  /**
   * Calulcate the cost of upload
   */
  private async calculateCost(frame_count: number): Promise<number> {
    // TODO: this should be moved to a config file or constants file
    const framecost = 0.001;
    return frame_count * framecost;
  }

  /**
   * Create a new dataset
   * @returns a Promise that resolves to the created dataset
   */
  async createDataset(
    userId: string,
    datasetData: { name: string; tags?: string[] },
  ): Promise<Dataset> {
    // should datasetData be declared somewhere else?

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
   * Returns the list of datasets for a certain user
   * @param filters filter bucket (really helpful) DO NOT REMOVE
   * @returns a Promise that resolves to an array of datasets
   */
  async getDatasets(
    userId: string,
    filters?: { tags?: string[] },
  ): Promise<Dataset[]> {
    return await this.datasetRepository.findByUserId(userId, filters);
  }

  /**
   * Returns a dataset by its ID
   * @returns a Promise that resolves to the dataset or null if not found
   */
  async getDatasetById(datasetId: string): Promise<Dataset | null> {
    return await this.datasetRepository.findById(datasetId);
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
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();

    // If updating the name, check for uniqueness
    if (updateData.name && updateData.name !== dataset.name) {
      const exists = await this.datasetRepository.existsByNameAndUserId(
        updateData.name,
        userId,
        datasetId,
      );
      if (exists)
        throw getError(ErrorEnum.DATASET_NAME_CONFLICT_ERROR).getErrorObj();
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
   * Adds videos to a dataset
   * @param datasetId id of the dataset where to put the video
   * @param userId the user requesting the insertion
   * @param content Array of video files or single video file
   * @returns a Promise that resolves with the result of the operation
   */
  async uploadVideo(
    datasetId: string,
    userId: string,
    content: Buffer,
    name: string,
    type: string,
  ): Promise<boolean> {
    // const supportedFormats = ["video/mp4"]; // better somewhere else, i think -beg

    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();

    if (type === "zip") {
      const files = await unzipBuffer(content, name);
      let total_frames = 0;

      // TODO: NEEEDS REFACTORING AND CHECKING FOR FILETYPES !!!!!!
      for (const file in files) {
        const frame_count = await this.calcFreameCount(
          `${name}-${faker.string.alphanumeric(10)}`,
          files[file].data,
        );
        total_frames = total_frames + frame_count;
      }

      const cost = await this.calculateCost(total_frames);

      const hasEnoughCredits = await this.userRepository.hasEnoughCredits(
        userId,
        cost,
      );
      if (!hasEnoughCredits)
        throw getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
      else {
        for (const file in files) {
          const frame_count = await this.calcFreameCount(
            `${name}-${faker.string.alphanumeric(10)}`,
            files[file].data,
          );
          await this.addVideoToRepo(name, content, datasetId, frame_count);
        }
        await this.userRepository.deductCredits(userId, cost);
      }
    } else if (type === "video") {
      // THIS IS ONLY FOR SINGLE VIDEO repeat all of this
      const frame_count = await this.calcFreameCount(name, content);
      const cost = await this.calculateCost(frame_count);
      const hasEnoughCredits = await this.userRepository.hasEnoughCredits(
        userId,
        cost,
      );

      if (!hasEnoughCredits)
        throw getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
      else {
        await this.addVideoToRepo(name, content, datasetId, frame_count);
        await this.userRepository.deductCredits(userId, cost);
      }
    }

    return false;

    // // TODO: hey mate, this is a placeholder, actually it's late and i need to sleep, tomorrow we discuss about this
    // return {
    //   message: "Video aggiunti con successo al dataset",
    //   datasetId,
    //   videosAdded: savedVideoIds.length,
    //   totalFrames,
    //   costDeducted: totalCost,
    //   videoIds: savedVideoIds,
    // };
  }
}
