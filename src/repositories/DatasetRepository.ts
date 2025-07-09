import { Dataset } from "../database/models/Dataset";
import {
  DatasetDAO,
  DatasetCreateAttributes,
  DatasetUpdateAttributes,
} from "../dao/DatasetDAO";
import { IDatasetRepository } from "./interfaces/IDatasetRepository";

/**
 * Dataset repository implementation
 * Provides business logic layer over DatasetDAO
 */
export class DatasetRepository implements IDatasetRepository {
  constructor(private datasetDAO: DatasetDAO) {}

  async create(data: DatasetCreateAttributes): Promise<Dataset> {
    return this.datasetDAO.create(data);
  }

  async findById(id: string): Promise<Dataset | null> {
    return this.datasetDAO.findById(id);
  }

  async findAll(options?: any): Promise<Dataset[]> {
    return this.datasetDAO.findAll(options);
  }

  async update(
    id: string,
    data: DatasetUpdateAttributes,
  ): Promise<Dataset | null> {
    return this.datasetDAO.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.datasetDAO.delete(id);
  }

  async findBy(criteria: any): Promise<Dataset[]> {
    return this.datasetDAO.findBy(criteria);
  }

  async findOneBy(criteria: any): Promise<Dataset | null> {
    return this.datasetDAO.findOneBy(criteria);
  }

  async count(criteria?: any): Promise<number> {
    return this.datasetDAO.count(criteria);
  }

  // Dataset-specific methods
  async findByUserId(userId: string): Promise<Dataset[]> {
    return this.datasetDAO.findByUserId(userId);
  }

  async findByTags(tags: string[]): Promise<Dataset[]> {
    return this.datasetDAO.findByTags(tags);
  }

  async findByUserAndName(
    userId: string,
    name: string,
  ): Promise<Dataset | null> {
    return this.datasetDAO.findByUserAndName(userId, name);
  }

  async softDelete(id: string): Promise<boolean> {
    return this.datasetDAO.softDelete(id);
  }

  async restore(id: string): Promise<boolean> {
    return this.datasetDAO.restore(id);
  }

  async findAllIncludingDeleted(options?: any): Promise<Dataset[]> {
    return this.datasetDAO.findAllIncludingDeleted(options);
  }

  async findByUserWithTags(
    userId: string,
    tags?: string[],
  ): Promise<Dataset[]> {
    return this.datasetDAO.findByUserWithTags(userId, tags);
  }

  async updateTags(id: string, tags: string[]): Promise<Dataset | null> {
    return this.datasetDAO.updateTags(id, tags);
  }

  async nameExistsForUser(
    userId: string,
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    return this.datasetDAO.nameExistsForUser(userId, name, excludeId);
  }
}
