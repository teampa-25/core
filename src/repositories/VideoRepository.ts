import { Video } from "../database/models";
import {
  VideoDAO,
  VideoCreateAttributes,
  VideoUpdateAttributes,
} from "../dao/VideoDAO";
import { IVideoRepository } from "./interfaces/IVideoRepository";
import { Op } from "sequelize";

/**
 * Video repository implementation
 * Provides business logic layer over VideoDAO
 */
export class VideoRepository implements IVideoRepository {
  constructor(private videoDAO: VideoDAO) {}

  async create(data: VideoCreateAttributes): Promise<Video> {
    return this.videoDAO.create(data);
  }

  async findById(id: string): Promise<Video | null> {
    return this.videoDAO.findById(id);
  }

  async findAll(options?: any): Promise<Video[]> {
    return this.videoDAO.findAll(options);
  }

  async update(id: string, data: VideoUpdateAttributes): Promise<Video | null> {
    return this.videoDAO.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.videoDAO.delete(id);
  }

  async findBy(criteria: any): Promise<Video[]> {
    return this.videoDAO.findBy(criteria);
  }

  async findOneBy(criteria: any): Promise<Video | null> {
    return this.videoDAO.findOneBy(criteria);
  }

  async count(criteria?: any): Promise<number> {
    return this.videoDAO.count(criteria);
  }

  // Video-specific methods
  async findByDatasetId(datasetId: string): Promise<Video[]> {
    return this.videoDAO.findByDatasetId(datasetId);
  }

  async findByDatasetAndName(
    datasetId: string,
    name: string,
  ): Promise<Video | null> {
    return this.videoDAO.findByDatasetAndName(datasetId, name);
  }

  async getTotalFrameCountForDataset(datasetId: string): Promise<number> {
    return this.videoDAO.getTotalFrameCountByDataset(datasetId);
  }

  async findByFrameCountRange(
    minFrames: number,
    maxFrames: number,
  ): Promise<Video[]> {
    // Utilizziamo findBy con criteri Sequelize
    return this.videoDAO.findBy({
      frame_count: {
        [Op.between]: [minFrames, maxFrames],
      },
    });
  }

  async findByDatasetWithFrameFilter(
    datasetId: string,
    minFrames?: number,
    maxFrames?: number,
  ): Promise<Video[]> {
    const whereClause: any = { dataset_id: datasetId };

    if (minFrames !== undefined || maxFrames !== undefined) {
      whereClause.frame_count = {};
      if (minFrames !== undefined) whereClause.frame_count[Op.gte] = minFrames;
      if (maxFrames !== undefined) whereClause.frame_count[Op.lte] = maxFrames;
    }

    return this.videoDAO.findBy(whereClause);
  }

  async updateFrameCount(
    id: string,
    frameCount: number,
  ): Promise<Video | null> {
    return this.videoDAO.update(id, { frame_count: frameCount });
  }

  async nameExistsInDataset(
    datasetId: string,
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    return this.videoDAO.nameExistsInDataset(datasetId, name, excludeId);
  }

  async getVideoCountForDataset(datasetId: string): Promise<number> {
    return this.videoDAO.count({ dataset_id: datasetId });
  }

  async deleteAllForDataset(datasetId: string): Promise<boolean> {
    try {
      const videos = await this.videoDAO.findByDatasetId(datasetId);
      const deletePromises = videos.map((video) =>
        this.videoDAO.delete(video.id),
      );
      const results = await Promise.all(deletePromises);
      return results.every((result) => result === true);
    } catch (error) {
      return false;
    }
  }
}
