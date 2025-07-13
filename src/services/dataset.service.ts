import { DatasetRepository } from "@/repositories/dataset.repository";
import { Dataset } from "@/models/dataset";

export class DatasetService {
  private datasetRepository: DatasetRepository;

  constructor() {
    this.datasetRepository = new DatasetRepository();
  }

  /**
   * Create a new dataset
   * @param userId
   * @param datasetData
   * @returns a Promise that resolves to the created dataset
   */
  async createDataset(
    userId: string,
    datasetData: {
      name: string;
      tags?: string[];
    },
  ): Promise<Dataset> {
    // Check
    const exists = await this.datasetRepository.existsByNameAndUserId(
      datasetData.name,
      userId,
    );

    if (exists) {
      throw new Error("Un dataset con questo nome esiste già");
    }

    const datasetId = await this.datasetRepository.create({
      user_id: userId,
      name: datasetData.name,
      tags: datasetData.tags || [],
    });

    // Retrieves the created dataset to return it
    const createdDataset = await this.datasetRepository.findById(datasetId);
    if (!createdDataset) {
      throw new Error("Errore nella creazione del dataset");
    }

    return createdDataset;
  }

  /**
   * Returns the list of datasets for a certain user
   * @param userId
   * @param filters filter bucket (really helpful) DO NOT REMOVE
   * @returns a Promise that resolves to an array of datasets
   */
  async getDatasets(
    userId: string,
    filters?: {
      tags?: string[];
    },
  ): Promise<Dataset[]> {
    return await this.datasetRepository.findByUserId(userId, filters);
  }

  /**
   * Returns a dataset by its ID
   * @param datasetId
   * @param userId
   * @returns a Promise that resolves to the dataset or null if not found
   */
  async getDatasetById(
    datasetId: string,
    userId?: string,
  ): Promise<Dataset | null> {
    if (userId) {
      return await this.datasetRepository.findByIdAndUserId(datasetId, userId);
    }
    return await this.datasetRepository.findById(datasetId);
  }

  /**
   * Updates a dataset
   * @param datasetId
   * @param userId
   * @param updateData
   * @returns a Promise that resolves to the updated dataset or null if not found
   */
  async updateDataset(
    datasetId: string,
    userId: string,
    updateData: {
      name?: string;
      tags?: string[];
    },
  ): Promise<Dataset | null> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) {
      throw new Error("Dataset non trovato");
    }

    // If updating the name, check for uniqueness
    if (updateData.name && updateData.name !== dataset.name) {
      const exists = await this.datasetRepository.existsByNameAndUserId(
        updateData.name,
        userId,
        datasetId,
      );

      if (exists) {
        throw new Error("Un dataset con questo nome esiste già");
      }
    }

    const updatedDataset = await this.datasetRepository.update(
      datasetId,
      updateData,
    );
    return updatedDataset;
  }

  /**
   * Soft deletes a dataset
   * @param datasetId
   * @param userId
   * @returns a Promise that resolves to true if the dataset was deleted, false otherwise
   */
  async deleteDataset(datasetId: string, userId: string): Promise<boolean> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) {
      throw new Error("Dataset non trovato");
    }

    return await this.datasetRepository.softDelete(datasetId);
  }

  /**
   * Adds videos to a dataset
   * @param datasetId
   * @param userId
   * @param videos
   * @returns a Promise that resolves to the updated dataset or null if not found
   */
  async addVideosToDataset(
    datasetId: string,
    userId: string,
    videos: any,
  ): Promise<any> {
    // Checks if the dataset belongs to the user
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) {
      throw new Error("Dataset non trovato");
    }

    // TODO: Implement video addition logic
    // - Validate video format
    // - Check user credits (0.001 per frame)
    // - Save video to dataset
    // - Update user credits

    return { message: "Funzionalità in fase di implementazione" };
  }
}
