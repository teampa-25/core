import { Job } from "bullmq";
import { CNSResponse, InferenceParameters } from "@/common/types";
import { ResultRepository } from "@/repositories/result.repository";
import axios from "axios";
import FormData from "form-data";
import enviroment from "@/config/enviroment";
import { ErrorEnum } from "@/common/enums";
import { getError } from "@/common/utils/api-error";
import { logger } from "@/config/logger";
import { FileSystemUtils } from "@/common/utils/file-system";
import { Result } from "@/models";

/**
 * Class responsible for processing inference jobs.
 * It handles the lifecycle of an inference job, including sending requests to the FastAPI server.
 */
export class InferenceJobProcessor {
  private resultRepository: ResultRepository;

  constructor() {
    this.resultRepository = new ResultRepository();
  }

  /**
   * Process an inference job.
   * @param job The job to process.
   */
  async processInference(job: Job): Promise<any> {
    const { inferenceId, userId, goalVideoPath, currentVideoPath, params } =
      job.data;

    try {
      // Read video files
      const [goalVideoBuffer, currentVideoBuffer] = await Promise.all([
        FileSystemUtils.readVideoFile(goalVideoPath),
        FileSystemUtils.readVideoFile(currentVideoPath),
      ]);

      const resultJson = await this.sendToFastAPI(
        inferenceId,
        params,
        goalVideoBuffer,
        currentVideoBuffer,
      );
      const resultZip = await this.downloadResultZip(resultJson.download_url);

      await this.saveResultsToDatabase(inferenceId, resultJson, resultZip);

      return resultJson;
    } catch (error) {
      logger.error(`Job ${inferenceId} failed with error: ${error}`);
      throw error;
    }
  }

  /**
   * Send inference request to the FastAPI server.
   * @param inferenceId The ID of the inference job.
   * @param parameters The parameters for the inference.
   * @param goalVideoBuffer The buffer containing the goal video.
   * @param currentVideoBuffer The buffer containing the current video.
   * @returns A promise that resolves to the CNSResponse from the FastAPI server.
   */
  private async sendToFastAPI(
    inferenceId: string,
    parameters: InferenceParameters,
    goalVideoBuffer: Buffer,
    currentVideoBuffer: Buffer,
  ): Promise<CNSResponse> {
    const baseUrl = `http://${enviroment.fastApiHost}:${enviroment.fastApiPort}`;
    const form = new FormData();

    // Add all form fields at once
    Object.entries({
      jobId: inferenceId,
      device: parameters.useGpus ? "cuda:0" : "cpu",
      detector: parameters.detector,
      goal_frame_idx: parameters.goalFrameId,
      frame_step: parameters.frameStep,
      start_frame: parameters.startFrame,
      end_frame: parameters.endFrame,
    }).forEach(([key, value]) => form.append(key, value));

    // Add video buffers
    form.append("goal_video", goalVideoBuffer, { filename: "goal.mp4" });
    form.append("current_video", currentVideoBuffer, {
      filename: "current.mp4",
    });

    const { data } = await axios.post<CNSResponse>(`${baseUrl}/analyze`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return data;
  }

  /**
   * Download the result ZIP file from the FastAPI server.
   * @param download_url The URL to download the ZIP file from.
   * @returns A promise that resolves to a Buffer containing the ZIP file data.
   */
  private async downloadResultZip(download_url: string): Promise<Buffer> {
    const baseUrl = `http://${enviroment.fastApiHost}:${enviroment.fastApiPort}`;
    const { data } = await axios.get<ArrayBuffer>(`${baseUrl}${download_url}`, {
      responseType: "arraybuffer",
    });
    return Buffer.from(data);
  }

  /**
   * Save inference results to the database.
   * @param inferenceId The ID of the inference job.
   * @param resultJson The JSON result of the inference.
   * @param resultZip The ZIP file containing the result images.
   */
  private async saveResultsToDatabase(
    inferenceId: string,
    resultJson: CNSResponse,
    resultZip: Buffer,
  ): Promise<void> {
    try {
      // const existingResult =
      //   await this.resultRepository.findByInferenceJobId(inferenceId);

      // if (existingResult) {
      //   // Update existing result in parallel
      //   await Promise.all([
      //     this.resultRepository.updateJsonResult(existingResult.id, resultJson),
      //     this.resultRepository.saveImageZip(existingResult.id, resultZip),
      //   ]);
      // } else {
      // Create new result
      const resultId = await this.resultRepository.createResult({
        inferenceJob_Id: inferenceId,
        json_res: resultJson,
      } as any);

      await this.resultRepository.saveImageZip(resultId, resultZip);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }
}
