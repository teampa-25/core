import { Result } from "@/models";
import { ResultDAO } from "@/dao/result.dao";
import { InferCreationAttributes } from "sequelize";
import { FileSystemUtils } from "@/common/utils/file-system";
import { CNSResponse } from "@/common/types";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";

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
   * @returns A Promise that resolves the result
   */
  async createResult(
    resultData: InferCreationAttributes<Result>,
  ): Promise<Result> {
    return await this.resultDAO.create(resultData);
  }

  /**
   * Finds a result by ID
   * @param id - The ID of the result
   * @returns A Promise that resolves to the result
   */
  async findById(id: string): Promise<Result> {
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
   * @returns A Promise that resolves to the result
   */
  async findByInferenceJobId(inferenceJobId: string): Promise<Result> {
    return await this.resultDAO.getByInferenceJobId(inferenceJobId);
  }

  /**
   * Updates the image ZIP data
   * @param id - The ID of the result
   * @param imageZipPath - The path to the image ZIP file
   * @returns A Promise that resolves to the updated result
   */
  async updateImageZip(id: string, imageZipPath: string): Promise<Result> {
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
        throw error;
      }
    }

    return await this.resultDAO.update(id, { image_zip: imageZipPath });
  }

  /**
   * Gets the JSON result data for a specific result
   * @param jobId - The ID of the job
   * @returns A Promise that resolves to the JSON result data
   */
  async getJsonResult(jobId: string): Promise<CNSResponse> {
    const result = await this.resultDAO.getByInferenceJobId(jobId);
    return result.json_res;
  }

  /**
   * Gets the image ZIP data for a specific result
   * @param jobId - The ID of the job
   * @returns A Promise that resolves to the image ZIP buffer
   */
  async getImageZip(jobId: string): Promise<Buffer> {
    const result = await this.resultDAO.getByInferenceJobId(jobId);

    // Check if file exists
    if (!FileSystemUtils.fileExists(result.image_zip)) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }

    // Read and return file as buffer
    return await FileSystemUtils.readZipFile(result.image_zip);
  }

  /**
   * Saves the image ZIP data to the filesystem and updates the result
   * @param id - The ID of the result
   * @param imageZip - The image ZIP buffer
   * @param userId - The user ID to determine the save path
   * @returns A Promise that resolves to the updated result
   */
  async saveImageZip(
    id: string,
    imageZip: Buffer,
    userId: string,
  ): Promise<Result> {
    // Use the user-specific results directory
    const basePath = FileSystemUtils.getResultsDirectoryPath(userId);
    const zipFileName = `result_${id}_${Date.now()}.zip`;
    const zipFilePath = `${basePath}/${zipFileName}`;

    // Ensure user directories exist
    await FileSystemUtils.ensureUserDirectories(userId);

    // Save ZIP file to filesystem
    await FileSystemUtils.writeZipFile(zipFilePath, imageZip);

    // Update result with file path
    return await this.updateImageZip(id, zipFilePath);
  }
}
