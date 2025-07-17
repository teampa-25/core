import { Result } from "@/models";
import { ResultDAO } from "@/dao/result.dao";
import { InferCreationAttributes } from "sequelize";
import { FileSystemUtils } from "@/common/utils/file-system";
import enviroment from "@/config/enviroment";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";
import { CNSResponse } from "@/common/types";

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
   * Finds a result by inference job ID
   * @param inferenceJobId - The inference job ID
   * @returns A Promise that resolves to the result or null if not found
   */
  async findByInferenceJobId(inferenceJobId: string): Promise<Result | null> {
    const allResults = await this.resultDAO.getAll();
    const result = allResults.find(
      (result) => result.inferenceJob_id === inferenceJobId,
    );
    return result || null;
  }

  // /**
  //  * Updates the JSON result data
  //  * @param id - The ID of the result
  //  * @param jsonRes - The JSON result data
  //  * @returns A Promise that resolves to the updated result or null if not found
  //  */
  // async updateJsonResult(id: string, jsonRes: object): Promise<Result | null> {
  //   return await this.resultDAO.update(id, { json_res: jsonRes });
  // }

  /**
   * Updates the image ZIP data
   * @param id - The ID of the result
   * @param imageZipPath - The path to the image ZIP file
   * @returns A Promise that resolves to the updated result or null if not found
   */
  async updateImageZip(
    id: string,
    imageZipPath: string,
  ): Promise<Result | null> {
    // Get the current result to check if it has an existing ZIP file
    const currentResult = await this.findById(id);

    // If there's an existing ZIP file, delete it
    if (
      currentResult &&
      currentResult.image_zip &&
      FileSystemUtils.fileExists(currentResult.image_zip)
    ) {
      try {
        await FileSystemUtils.deleteFile(currentResult.image_zip);
      } catch (error) {
        throw getError(ErrorEnum.GENERIC_ERROR);
      }
    }

    return await this.resultDAO.update(id, { image_zip: imageZipPath });
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
   * @param jobId - The ID of the job
   * @returns A Promise that resolves to the JSON result data or null if not found
   */
  async getJsonResult(jobId: string): Promise<CNSResponse | null> {
    const result = await this.resultDAO.getByInferenceJobId(jobId);
    return result ? result.json_res : null;
  }

  /**
   * Gets the image ZIP data for a specific result
   * @param jobId - The ID of the job
   * @returns A Promise that resolves to the image ZIP buffer or null if not found
   */
  async getImageZip(jobId: string): Promise<Buffer | null> {
    const result = await this.resultDAO.getByInferenceJobId(jobId);
    if (!result || !result.image_zip) return null;

    // Check if file exists
    if (!FileSystemUtils.fileExists(result.image_zip)) {
      return null;
    }

    // Read and return file as buffer
    return await FileSystemUtils.readZipFile(result.image_zip);
  }

  /**
   * Saves the image ZIP data to the filesystem and updates the result
   * @param id - The ID of the result
   * @param imageZip - The image ZIP buffer
   * @param basePath - The base path where to save the file (optional)
   * @returns A Promise that resolves to the updated result or null if not found
   */
  async saveImageZip(
    id: string,
    imageZip: Buffer,
    basePath: string = enviroment.resultsBasePath,
  ): Promise<Result | null> {
    const zipFileName = `result_${id}_${Date.now()}.zip`;
    const zipFilePath = `${basePath}/${zipFileName}`;

    // Save ZIP file to filesystem
    await FileSystemUtils.writeZipFile(zipFilePath, imageZip);

    // Update result with file path
    return await this.updateImageZip(id, zipFilePath);
  }
}
