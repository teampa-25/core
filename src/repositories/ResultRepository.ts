import { Result } from "../database/models";
import {
  ResultDAO,
  ResultCreateAttributes,
  ResultUpdateAttributes,
} from "../dao/ResultDAO";
import { IResultRepository } from "./interfaces/IResultRepository";

/**
 * Result repository implementation
 * Provides business logic layer over ResultDAO
 */
export class ResultRepository implements IResultRepository {
  constructor(private resultDAO: ResultDAO) {}

  async create(data: ResultCreateAttributes): Promise<Result> {
    return this.resultDAO.create(data);
  }

  async findById(id: string): Promise<Result | null> {
    return this.resultDAO.findById(id);
  }

  async findAll(options?: any): Promise<Result[]> {
    return this.resultDAO.findAll(options);
  }

  async update(
    id: string,
    data: ResultUpdateAttributes,
  ): Promise<Result | null> {
    return this.resultDAO.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.resultDAO.delete(id);
  }

  async findBy(criteria: any): Promise<Result[]> {
    return this.resultDAO.findBy(criteria);
  }

  async findOneBy(criteria: any): Promise<Result | null> {
    return this.resultDAO.findOneBy(criteria);
  }

  async count(criteria?: any): Promise<number> {
    return this.resultDAO.count(criteria);
  }

  // Result-specific methods
  async findByInferenceJobId(inferenceJobId: string): Promise<Result | null> {
    return this.resultDAO.findByInferenceJobId(inferenceJobId);
  }

  async updateJsonResult(id: string, jsonRes: object): Promise<Result | null> {
    return this.resultDAO.updateJsonResult(id, jsonRes);
  }

  async updateImageZip(id: string, imageZip: Buffer): Promise<Result | null> {
    return this.resultDAO.updateImageZip(id, imageZip);
  }

  async findByUserId(userId: string): Promise<Result[]> {
    // TODO: join with InferenceJob to filter by userId
    return this.resultDAO.findAll();
  }

  async findByDatasetId(datasetId: string): Promise<Result[]> {
    // TODO: join with InferenceJob to filter by datasetId
    return this.resultDAO.findAll();
  }

  async getStorageSize(id: string): Promise<number> {
    const result = await this.resultDAO.findById(id);
    if (!result) return 0;

    const jsonSize = JSON.stringify(result.json_res).length;
    const imageSize = result.image_zip.length;
    return jsonSize + imageSize;
  }

  async getTotalStorageSizeForUser(userId: string): Promise<number> {
    const stats = await this.resultDAO.getStorageStats();
    return stats.totalJsonSize + stats.totalImageZipSize;
  }

  async deleteByInferenceJobId(inferenceJobId: string): Promise<boolean> {
    return this.resultDAO.deleteByInferenceJobId(inferenceJobId);
  }

  async existsForInferenceJob(inferenceJobId: string): Promise<boolean> {
    return this.resultDAO.existsForInferenceJob(inferenceJobId);
  }

  async getResultsCountForUser(userId: string): Promise<number> {
    // TODO: join with InferenceJob to filter by userId
    return this.resultDAO.count();
  }

  async findResultsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Result[]> {
    return this.resultDAO.findResultsInDateRange(startDate, endDate);
  }
}
