import { Dataset } from "@/models";
import { DatasetDAO } from "@/dao/dataset.dao";

/**
 * DatasetRepository is responsible for managing dataset data.
 * It provides methods to create, find, update, and delete datasets.
 */
export class DatasetRepository {
  private datasetDAO: DatasetDAO;

  constructor() {
    this.datasetDAO = new DatasetDAO();
  }

  /**
   * Creates a new dataset
   * @param datasetData
   * @returns a Promise that resolves to the ID of the created dataset
   */
  async create(datasetData: {
    user_id: string;
    name: string;
    tags?: string[];
  }): Promise<string> {
    return await this.datasetDAO.create({
      user_id: datasetData.user_id,
      name: datasetData.name,
      tags: datasetData.tags || [],
    } as Dataset);
  }

  /**
   * Finds all datasets for a user with optional filters
   * @param userId
   * @param filters
   * @returns a Promise that resolves to an array of datasets
   */
  async findByUserId(
    userId: string,
    filters?: {
      tags?: string[];
    },
  ): Promise<Dataset[]> {
    if (filters?.tags && filters.tags.length > 0) {
      // Usa il metodo filterByTags del DAO e filtra per user_id
      const datasets = await this.datasetDAO.filterByTags(filters.tags);
      return datasets.filter((dataset) => dataset.user_id === userId);
    }

    // Se non ci sono filtri per tag, ottieni tutti i dataset dell'utente
    const allDatasets = await this.datasetDAO.getAll();
    return allDatasets.filter((dataset) => dataset.user_id === userId);
  }

  /**
   * Finds a dataset by ID
   * @param id
   * @returns a Promise that resolves to the dataset or null if not found
   */
  async findById(id: string): Promise<Dataset | null> {
    return await this.datasetDAO.get(id);
  }

  /**
   * Finds a dataset by ID and user ID
   * @param id
   * @param userId
   * @returns a Promise that resolves to the dataset or null if not found
   */
  async findByIdAndUserId(id: string, userId: string): Promise<Dataset | null> {
    const dataset = await this.datasetDAO.get(id);
    if (dataset && dataset.user_id === userId) {
      return dataset;
    }
    return null;
  }

  /**
   * Checks if a dataset with the same name exists for the user
   * @param name
   * @param userId
   * @param excludeId
   * @returns a Promise that resolves to true if exists, false otherwise
   */
  async existsByNameAndUserId(
    name: string,
    userId: string,
    excludeId?: string,
  ): Promise<boolean> {
    const allDatasets = await this.datasetDAO.getAll();

    return allDatasets.some(
      (dataset) =>
        dataset.name === name &&
        dataset.user_id === userId &&
        dataset.id !== excludeId,
    );
  }

  /**
   * Updates a dataset
   * @param id
   * @param updateData
   * @returns a Promise that resolves to the updated dataset or null if not found
   */
  async update(
    id: string,
    updateData: {
      name?: string;
      tags?: string[];
    },
  ): Promise<Dataset | null> {
    return await this.datasetDAO.update(id, updateData);
  }

  /**
   * Soft deletes a dataset
   * @param id
   * @returns a Promise that resolves to true if the dataset was deleted, false otherwise
   */
  async softDelete(id: string): Promise<boolean> {
    return await this.datasetDAO.delete(id);
  }
}
