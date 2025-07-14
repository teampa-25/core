import { Result } from "@/models/result";
import { ResultDAO } from "@/dao/result.dao";
import { ErrorEnum, getError } from "@/utils/api-error";
import { InferCreationAttributes } from "sequelize";

/**
 * ResultRepository is responsible for managing result data.
 * It provides methods to create, find, update, and delete results.
 */
export class ResultRepository {
  private resultDAO: ResultDAO;

  constructor() {
    this.resultDAO = new ResultDAO();
  }

  /**
   * Creates a new result
   * @param resultData - The data for the new result
   * @returns A Promise that resolves to the result ID
   */
  async createResult(
    resultData: InferCreationAttributes<Result>,
  ): Promise<string> {
    return await this.resultDAO.create(resultData);
  }

  /**
   * Finds a result by ID
   * @param id - The ID of the result
   * @returns A Promise that resolves to the result or null if not found
   */
  async findById(id: string): Promise<Result | null> {
    return await this.resultDAO.get(id);
  }

  /**
   * Retrieves all results
   * @returns A Promise that resolves to an array of all results
   */
  async findAll(): Promise<Result[]> {
    return await this.resultDAO.getAll();
  }

  /**
   * Updates a result
   * @param id - The ID of the result to update
   * @param updateData - The data to update
   * @returns A Promise that resolves to the updated result or null if not found
   */
  async updateResult(
    id: string,
    updateData: Partial<Result>,
  ): Promise<Result | null> {
    return await this.resultDAO.update(id, updateData);
  }

  /**
   * Deletes a result
   * @param id - The ID of the result to delete
   * @returns A Promise that resolves to true if deleted, false otherwise
   */
  async deleteResult(id: string): Promise<boolean> {
    return await this.resultDAO.delete(id);
  }

  /**
   * Finds a result by inference job ID
   * @param inferenceJobId - The inference job ID
   * @returns A Promise that resolves to the result or null if not found
   */
  async findByInferenceJobId(inferenceJobId: string): Promise<Result | null> {
    const allResults = await this.resultDAO.getAll();
    const result = allResults.find(
      (result) => result.inference_job_id === inferenceJobId,
    );
    return result || null;
  }

  /**
   * Updates the JSON result data
   * @param id - The ID of the result
   * @param jsonRes - The JSON result data
   * @returns A Promise that resolves to the updated result or null if not found
   */
  async updateJsonResult(id: string, jsonRes: object): Promise<Result | null> {
    return await this.resultDAO.update(id, { json_res: jsonRes });
  }

  /**
   * Updates the image ZIP data
   * @param id - The ID of the result
   * @param imageZip - The image ZIP buffer
   * @returns A Promise that resolves to the updated result or null if not found
   */
  async updateImageZip(id: string, imageZip: Buffer): Promise<Result | null> {
    return await this.resultDAO.update(id, { image_zip: imageZip });
  }

  /**
   * Checks if a result exists
   * @param id - The ID of the result
   * @returns A Promise that resolves to true if the result exists, false otherwise
   */
  async exists(id: string): Promise<boolean> {
    const result = await this.resultDAO.get(id);
    return result !== null;
  }

  /**
   * Checks if a result exists for a specific inference job
   * @param inferenceJobId - The inference job ID
   * @returns A Promise that resolves to true if a result exists for the job, false otherwise
   */
  async existsForInferenceJob(inferenceJobId: string): Promise<boolean> {
    const result = await this.findByInferenceJobId(inferenceJobId);
    return result !== null;
  }

  /**
   * Gets the JSON result data for a specific result
   * @param id - The ID of the result
   * @returns A Promise that resolves to the JSON result data or null if not found
   */
  async getJsonResult(jobId: string): Promise<object | null> {
    const result = await this.resultDAO.getByInferenceJobId(jobId);
    return result ? result.json_res : null;
  }

  /**
   * Gets the image ZIP data for a specific result
   * @param id - The ID of the result
   * @returns A Promise that resolves to the image ZIP buffer or null if not found
   */
  async getImageZip(id: string): Promise<Buffer | null> {
    const result = await this.resultDAO.get(id);
    return result ? result.image_zip : null;
  }
}
