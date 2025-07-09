import { Video } from "../../database/models";
import {
  VideoCreateAttributes,
  VideoUpdateAttributes,
} from "../../dao/VideoDAO";
import { IBaseRepository } from "./IBaseRepository";

/**
 * Video repository interface defining Video-specific operations
 */
export interface IVideoRepository
  extends IBaseRepository<Video, VideoCreateAttributes, VideoUpdateAttributes> {
  /**
   * Find videos by dataset ID
   */
  findByDatasetId(datasetId: string): Promise<Video[]>;

  /**
   * Find video by dataset and name
   */
  findByDatasetAndName(datasetId: string, name: string): Promise<Video | null>;

  /**
   * Get total frame count for a dataset
   */
  getTotalFrameCountForDataset(datasetId: string): Promise<number>;

  /**
   * Find videos by frame count range
   */
  findByFrameCountRange(minFrames: number, maxFrames: number): Promise<Video[]>;

  /**
   * Find videos by dataset with frame count filter
   */
  findByDatasetWithFrameFilter(
    datasetId: string,
    minFrames?: number,
    maxFrames?: number,
  ): Promise<Video[]>;

  /**
   * Update video frame count
   */
  updateFrameCount(id: string, frameCount: number): Promise<Video | null>;

  /**
   * Check if video name exists in dataset
   */
  nameExistsInDataset(
    datasetId: string,
    name: string,
    excludeId?: string,
  ): Promise<boolean>;

  /**
   * Get video count for dataset
   */
  getVideoCountForDataset(datasetId: string): Promise<number>;

  /**
   * Delete all videos for a dataset
   */
  deleteAllForDataset(datasetId: string): Promise<boolean>;
}
