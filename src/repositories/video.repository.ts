import { Video } from "@/models/video";
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
   * @returns a Promise that resolves to the ID of the created video
   */
  async create(videoData: {
    dataset_id: string;
    file: Buffer;
    name: string;
    frame_count: number;
  }): Promise<string> {
    return await this.videoDAO.create({
      dataset_id: videoData.dataset_id,
      file: videoData.file,
      name: videoData.name,
      frame_count: videoData.frame_count,
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
   * Finds a video by ID
   * @param id
   * @returns a Promise that resolves to the video or null if not found
   */
  async findById(id: string): Promise<Video | null> {
    return await this.videoDAO.get(id);
  }

  /**
   * Finds a video by ID and dataset ID (to verify ownership)
   * @param id
   * @param datasetId
   * @returns a Promise that resolves to the video or null if not found
   */
  async findByIdAndDatasetId(
    id: string,
    datasetId: string,
  ): Promise<Video | null> {
    const video = await this.videoDAO.get(id);
    if (video && video.dataset_id === datasetId) {
      return video;
    }
    return null;
  }

  /**
   * Gets the total number of frames for all videos in a dataset
   * @param datasetId
   * @returns a Promise that resolves to the total number of frames
   */
  async getTotalFramesByDatasetId(datasetId: string): Promise<number> {
    const videos = await this.findByDatasetId(datasetId);
    return videos.reduce((total, video) => total + video.frame_count, 0);
  }

  /**
   * Deletes a video
   * @param id
   * @returns a Promise that resolves to true if the video was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    return await this.videoDAO.delete(id);
  }

  /**
   * Updates a video
   * @param id
   * @param updateData
   * @returns a Promise that resolves to the updated video or null if not found
   */
  async update(
    id: string,
    updateData: {
      name?: string;
      frame_count?: number;
    },
  ): Promise<Video | null> {
    return await this.videoDAO.update(id, updateData);
  }
}
