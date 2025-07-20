import { Video } from "@/models";
import { VideoDAO } from "@/dao/video.dao";

/**
 * VideoRepository is responsible for managing video data in the dataset.
 * It provides methods to create, find, update, and delete videos.
 */
export class VideoRepository {
  private videoDAO: VideoDAO;

  constructor() {
    this.videoDAO = new VideoDAO();
  }

  /**
   * Create a new video in the dataset
   * @param videoData
   * @returns a Promise that resolves the created video
   */
  async create(videoData: {
    datasetId: string;
    name: string;
    frameCount: number;
  }): Promise<Video> {
    return await this.videoDAO.create({
      dataset_id: videoData.datasetId,
      name: videoData.name,
      frame_count: videoData.frameCount,
    } as Video);
  }

  /**
   * Finds all videos in a dataset
   * @param datasetId
   * @returns a Promise that resolves to an array of videos
   */
  async findByDatasetId(datasetId: string): Promise<Video[]> {
    const allVideos = await this.videoDAO.getAll();
    return allVideos.filter((video) => video.dataset_id === datasetId);
  }

  /**
   * Finds videos by range
   * @param datasetId - The dataset ID
   * @param offset - The offset for range
   * @param limit - The limit for range
   * @returns array of video into the range
   */
  async findByRange(
    datasetId: string,
    offset: number,
    limit: number,
  ): Promise<Video[]> {
    return await this.videoDAO.getByRange(datasetId, offset, limit);
  }

  /**
   * Finds a video by ID
   * @param id
   * @returns a Promise that resolves to the video
   */
  async findById(id: string): Promise<Video> {
    return await this.videoDAO.get(id);
  }

  /**
   * Deletes a video
   * @param id
   */
  async delete(id: string): Promise<void> {
    await this.videoDAO.delete(id);
  }

  /**
   * Updates a video
   * @param id
   * @param updateData
   * @returns a Promise that resolves to the updated video
   */
  async update(
    id: string,
    updateData: {
      name?: string;
      frame_count?: number;
      file?: string;
    },
  ): Promise<Video> {
    return await this.videoDAO.update(id, updateData);
  }
}
