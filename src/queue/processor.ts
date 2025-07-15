import { Job } from "bullmq";
import { InferenceJobService } from "../services/inference.service";
import { InferenceJobStatus } from "@/common/enums";
import { CNSResponse, InferenceParameters } from "@/common/types";
import axios from "axios";
import FormData from "form-data";
import enviroment from "@/config/enviroment";

export class InferenceJobProcessor {
  private inferenceJobService: InferenceJobService;

  constructor() {
    this.inferenceJobService = new InferenceJobService();
  }

  async processInference(job: Job): Promise<void> {
    const { inferenceId, parameters, goalVideoBuffer, currentVideoBuffer } =
      job.data;

    try {
      await this.inferenceJobService.updateInferenceStatus(
        inferenceId,
        InferenceJobStatus.RUNNING,
      );

      //do inference
      const resultJson = await this.sendToFastAPI(
        inferenceId,
        parameters,
        goalVideoBuffer,
        currentVideoBuffer,
      );
      const resultZip = await this.downloadResultZip(resultJson.download_url);

      //TODO: Save results into DB

      await this.inferenceJobService.updateInferenceStatus(
        inferenceId,
        InferenceJobStatus.COMPLETED,
      );
    } catch (error) {
      console.error(`Errore durante inferenza ${inferenceId}:`, error);

      await this.inferenceJobService.updateInferenceStatus(
        inferenceId,
        InferenceJobStatus.FAILED,
      );

      throw error;
    }
  }

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

  private async downloadResultZip(download_url: string): Promise<Buffer> {
    const response = await axios.get<ArrayBuffer>(
      `http://${enviroment.fastApiHost}:${enviroment.fastApiPort}${download_url}`,
      { responseType: "arraybuffer" },
    );
    return Buffer.from(response.data);
  }
}
