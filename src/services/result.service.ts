import { Result } from "@/models/result";
import { ResultRepository } from "@/repositories/result.repository";
import { ErrorEnum, getError } from "@/utils/api-error";
import { InferCreationAttributes } from "sequelize";

export class ResultService {
  private resultRepository: ResultRepository;

  constructor() {
    this.resultRepository = new ResultRepository();
  }

  /**
   * Gets the result by inference job ID
   * @param inferenceJobId - The inference job ID
   * @returns A Promise that resolves to the result or throws error if not found
   */
  async getResultByInferenceJobId(inferenceJobId: string): Promise<Result> {
    const result =
      await this.resultRepository.findByInferenceJobId(inferenceJobId);

    if (!result) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }

    return result;
  }

  /**
   * Gets the JSON result data for a specific inference job
   * @param inferenceJobId - The inference job ID
   * @returns A Promise that resolves to the JSON result data
   */
  async getJsonResultByInferenceJobId(inferenceJobId: string): Promise<object> {
    const result = await this.getResultByInferenceJobId(inferenceJobId);
    return result.json_res;
  }

  /**
   * Gets the image ZIP data for a specific inference job
   * @param inferenceJobId - The inference job ID
   * @returns A Promise that resolves to the image ZIP buffer
   */
  async getImageZipByInferenceJobId(inferenceJobId: string): Promise<Buffer> {
    const result = await this.getResultByInferenceJobId(inferenceJobId);
    return result.image_zip;
  }

  /**
   * Creates a new result
   * @param resultData - The data for the new result
   * @returns A Promise that resolves to the created result ID
   */
  async createResult(
    resultData: InferCreationAttributes<Result>,
  ): Promise<string> {
    return await this.resultRepository.createResult(resultData);
  }

  /**
   * Checks if a result exists for a specific inference job
   * @param inferenceJobId - The inference job ID
   * @returns A Promise that resolves to true if result exists, false otherwise
   */
  async resultExistsForInferenceJob(inferenceJobId: string): Promise<boolean> {
    return await this.resultRepository.existsForInferenceJob(inferenceJobId);
  }
}
