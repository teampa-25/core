import { Job } from "bullmq";
import { CNSResponse, InferenceParameters } from "@/common/types";
import { ResultRepository } from "@/repositories/result.repository";
import axios from "axios";
import FormData from "form-data";
import enviroment from "@/config/enviroment";
import { ErrorEnum, InferenceJobStatus } from "@/common/enums";
import { getError } from "@/common/utils/api-error";
import { logger } from "@/config/logger";

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
  async processInference(job: Job): Promise<void> {
    const { inferenceId, parameters, goalVideoBuffer, currentVideoBuffer } =
      job.data;

    try {
      logger.debug("Processing inference job aaaaaah diocan");
      logger.debug("Inference Job Data", {
        inferenceId,
        parameters,
      });

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula inferenza
      // // do inference
      // const resultJson = await this.sendToFastAPI(
      //   inferenceId,
      //   parameters,
      //   goalVideoBuffer,
      //   currentVideoBuffer,
      // );
      // const resultZip = await this.downloadResultZip(resultJson.download_url);
      // // Save results into DB
      // await this.saveResultsToDatabase(inferenceId, resultJson, resultZip);
    } catch (error) {
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
    goalVideoBuffer: ArrayBuffer,
    currentVideoBuffer: ArrayBuffer,
  ): Promise<CNSResponse> {
    const form = new FormData();
    form.append("jobId", inferenceId);
    form.append("device", parameters.useGpus ? "cuda:0" : "cpu");
    form.append("detector", parameters.detector);
    form.append("goal_video", goalVideoBuffer, { filename: "goal.mp4" });
    form.append("current_video", currentVideoBuffer, {
      filename: "current.mp4",
    });
    form.append("goal_frame_idx", parameters.goalFrameId);
    form.append("frame_step", parameters.frameStep);
    form.append("start_frame", parameters.startFrame);
    form.append("end_frame", parameters.endFrame);

    const res = await axios.post<CNSResponse>(
      `http://${enviroment.fastApiHost}:${enviroment.fastApiPort}/analyze`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    );

    return res.data;
  }

  /**
   * Download the result ZIP file from the FastAPI server.
   * @param download_url The URL to download the ZIP file from.
   * @returns A promise that resolves to a Buffer containing the ZIP file data.
   */
  private async downloadResultZip(download_url: string): Promise<Buffer> {
    const response = await axios.get<ArrayBuffer>(
      `http://${enviroment.fastApiHost}:${enviroment.fastApiPort}${download_url}`,
      { responseType: "arraybuffer" },
    );
    return Buffer.from(response.data);
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
      // Existing result check
      const existingResult =
        await this.resultRepository.findByInferenceJobId(inferenceId);

      if (existingResult) {
        // Update existing result
        await this.resultRepository.updateJsonResult(
          existingResult.id,
          resultJson,
        );
        await this.resultRepository.saveImageZip(existingResult.id, resultZip);
      } else {
        // Create new result
        const resultId = await this.resultRepository.createResult({
          inference_job_id: inferenceId,
          json_res: resultJson,
        } as any);

        // Save ZIP file to filesystem
        await this.resultRepository.saveImageZip(resultId, resultZip);
      }
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }
}
