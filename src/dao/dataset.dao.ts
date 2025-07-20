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
      throw error;
    }
  }

  /**
   * Retrieves a dataset by its ID
   * @param id - The ID of the dataset to retrieve
   * @param userId - the id of the dataset's owner
   * @returns Promise<Dataset> - The dataset if found
   */
  async get(id: string): Promise<Dataset> {
    try {
      const dataset = await Dataset.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });
      if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR);
      return dataset;
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  /**
   * Updates a dataset by its ID
   * @param id - The ID of the dataset to update
   * @param data - The new data for the dataset
   * @returns Promise<Dataset> - The updated dataset if found
   */
  async update(id: string, data: Partial<Dataset>): Promise<Dataset> {
    try {
      const dataset = await this.get(id);
      return await dataset.update(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a dataset by its ID
   * @param id - The ID of the dataset to delete
   */
  async delete(id: string): Promise<void> {
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

      if (updatedRowsCount == 0) throw getError(ErrorEnum.GENERIC_ERROR);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new Dataset
   * @param data - The data for the new dataset
   * @returns A Promise that resolves to the created dataset
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<Dataset>): Promise<Dataset> {
    try {
      return await Dataset.create(data);
    } catch (error) {
      throw error;
    }
  }
}
