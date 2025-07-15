import { Dataset } from "@/models";
import { IDAO } from "@/dao/interfaces/idao";
import { getError } from "@/common/utils/api-error";
import { Op, InferCreationAttributes } from "sequelize";
import { ErrorEnum } from "@/common/enums";

/**
 * DatasetDAO class implements IDAO interface for Dataset model
 * Provides methods to create, retrieve, update, and delete datasets
 */
export class DatasetDAO implements IDAO<Dataset> {
  async create(data: InferCreationAttributes<Dataset>): Promise<string> {
    try {
      const createdDataset = await Dataset.create(data);
      return createdDataset.id;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Filters datasets by tags
   * @param tags - Array of tags to filter by
   * @returns Promise<Dataset[]> - Array of datasets matching the tags
   */
  async filterByTags(tags: string[]): Promise<Dataset[]> {
    try {
      const datasets = await Dataset.findAll({
        where: {
          tags: {
            [Op.overlap]: tags,
          },
          deleted_at: null,
        },
      });
      return datasets;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Retrieves a dataset by its ID
   * @param id - The ID of the dataset to retrieve
   * @returns Promise<Dataset | null> - The dataset if found, null otherwise
   */
  async get(id: string): Promise<Dataset | null> {
    try {
      const dataset = await Dataset.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });
      return dataset;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Retrieves all datasets
   * @returns Promise<Dataset[]> - Array of all datasets
   */
  async getAll(): Promise<Dataset[]> {
    try {
      const datasets = await Dataset.findAll({
        where: {
          deleted_at: null,
        },
      });
      return datasets;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Updates a dataset by its ID
   * @param id - The ID of the dataset to update
   * @param data - The new data for the dataset
   * @returns Promise<Dataset | null> - The updated dataset if found, null otherwise
   */
  async update(id: string, data: Partial<Dataset>): Promise<Dataset | null> {
    try {
      const dataset = await this.get(id);

      if (!dataset) {
        return null;
      }

      return await dataset.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Deletes a dataset by its ID
   * @param id - The ID of the dataset to delete
   * @returns Promise<boolean> - True if the dataset was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    try {
      const [updatedRowsCount] = await Dataset.update(
        { deleted_at: new Date() },
        {
          where: {
            id,
            deleted_at: null,
          },
        },
      );

      return updatedRowsCount > 0;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }
}
