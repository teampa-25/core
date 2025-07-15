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
   * @returns A Promise that resolves to the video or null if not found
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<Video | null> {
    try {
      return await Video.findByPk(id);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
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
      throw getError(ErrorEnum.GENERIC_ERROR);
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
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Updates a video by its ID
   * @param id - The ID of the video to update
   * @param data - The new data for the video
   * @returns A Promise that resolves to the updated video or null if not found
   * @throws Error if the update operation fails
   */
  async update(id: string, data: Partial<Video>): Promise<Video | null> {
    try {
      const updateVideo = await this.get(id);

      if (!updateVideo) {
        return null;
      }

      return await updateVideo.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Deletes a video by its ID
   * @param id - The ID of the video to delete
   * @returns A Promise that resolves to true if the video was deleted, false otherwise
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<boolean> {
    try {
      const deleteVideo = await this.get(id);

      if (!deleteVideo) {
        return false;
      }

      await deleteVideo.destroy();
      return true;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Creates a new video
   * @param data - The data for the new video
   * @returns A Promise that resolves to the ID of the created video
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<Video>): Promise<string> {
    try {
      const newVideo = await Video.create(data);

      if (!newVideo.id) {
        throw getError(ErrorEnum.GENERIC_ERROR);
      }

      return newVideo.id;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }
}
