import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao";
import { Video } from "@/models";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";

/**
 * VideoDAO class implements IDAO interface for Video model
 * Provides methods to create, retrieve, update, and delete videos
 */
export class VideoDAO implements IDAO<Video> {
  /**
   * Retrieves a video by its ID
   * @param id - The ID of the video to retrieve
   * @returns A Promise that resolves to the video
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<Video> {
    try {
      const video = await Video.findByPk(id);
      if (!video) throw getError(ErrorEnum.NOT_FOUND_ERROR);
      return video;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all videos
   * @returns A Promise that resolves to an array of all videos
   * @throws Error if the retrieval operation fails
   */
  async getAll(): Promise<Video[]> {
    try {
      return await Video.findAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves videos from a dataset with pagination
   * @param datasetId - The ID of the dataset
   * @param offset - Number of videos to skip
   * @param limit - Maximum number of videos to return
   * @returns A Promise that resolves to an array of videos
   * @throws Error if the retrieval operation fails
   */
  async getByRange(
    datasetId: string,
    offset: number,
    limit: number,
  ): Promise<Video[]> {
    try {
      return await Video.findAll({
        where: {
          dataset_id: datasetId,
        },
        offset,
        limit,
        order: [["created_at", "ASC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a video by its ID
   * @param id - The ID of the video to update
   * @param data - The new data for the video
   * @returns A Promise that resolves to the updated video
   * @throws Error if the update operation fails
   */
  async update(id: string, data: Partial<Video>): Promise<Video> {
    try {
      const updateVideo = await this.get(id);
      return await updateVideo.update(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a video by its ID
   * @param id - The ID of the video to delete
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<void> {
    try {
      const deleteVideo = await this.get(id);
      await deleteVideo.destroy();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new video
   * @param data - The data for the new video
   * @returns A Promise that resolves to the created video
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<Video>): Promise<Video> {
    try {
      return await Video.create(data);
    } catch (error) {
      throw error;
    }
  }
}
