import { Video } from "@/models";
import { InferenceJob } from "@/models";
import { Result } from "@/models";
import { inferenceQueue } from "@/queue/queue";
import { DatasetRepository } from "@/repositories/dataset.repository";
import { InferenceJobRepository } from "@/repositories/inference.job.repository";
import { ResultRepository } from "@/repositories/result.repository";
import { UserRepository } from "@/repositories/user.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { WebSocketService } from "@/services/websocket.service";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum, InferenceJobStatus } from "@/common/enums";
import { INFERENCE } from "@/common/const";
import { th } from "@faker-js/faker/.";
import { InferCreationAttributes } from "sequelize";
import { InferenceParameters } from "@/common/types";

export class InferenceJobService {
  private inferenceRepository: InferenceJobRepository;
  private datasetRepository: DatasetRepository;
  private userRepository: UserRepository;
  private videoRepository: VideoRepository;
  private resultRepository: ResultRepository;
  private wsService: WebSocketService;

  constructor() {
    this.inferenceRepository = new InferenceJobRepository();
    this.datasetRepository = new DatasetRepository();
    this.userRepository = new UserRepository();
    this.videoRepository = new VideoRepository();
    this.resultRepository = new ResultRepository();
    this.wsService = WebSocketService.getInstance();
  }

  public enqueueJob = async (
    userId: string,
    datasetId: string,
    parameters: InferenceParameters,
    range: string,
  ): Promise<string[]> => {
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();

    const videos =
      range === "all"
        ? await this.videoRepository.findByDatasetId(datasetId)
        : await this.getVideosByRange(datasetId, range);

    if (!videos || videos.length === 0) {
      throw getError(ErrorEnum.BAD_REQUEST_ERROR).getErrorObj();
    }

    const sorted = videos.sort(
      (a: Video, b: Video) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    const createdJobIds: string[] = [];

    // if only one video selected then targer == current
    if (sorted.length === 1) {
      const video = sorted[0];
      const jobData = {
        dataset_id: datasetId,
        user_id: userId,
        goal_id: video.id,
        current_id: video.id,
        params: parameters,
      } as InferCreationAttributes<InferenceJob>;

      const inferenceId =
        await this.inferenceRepository.createInferenceJob(jobData);
      createdJobIds.push(inferenceId);

      // Notify job queued
      this.wsService.notifyInferenceStatusUpdate(
        userId,
        inferenceId,
        InferenceJobStatus.PENDING,
      );

      await inferenceQueue.add("run", {
        inferenceId: inferenceId,
        goalVideoBuffer: video.file,
        currentVideoBuffer: video.file,
        params: parameters,
      });

      return createdJobIds;
    }

    // Otherwise creates multiple jobs with coupled videos
    for (let i = 0; i < sorted.length - 1; i++) {
      const target = sorted[i];
      const current = sorted[i + 1];

      const jobData = {
        dataset_id: datasetId,
        user_id: userId,
        goal_id: target.id,
        current_id: current.id,
        params: parameters,
      } as InferCreationAttributes<InferenceJob>;

      const inferenceId =
        await this.inferenceRepository.createInferenceJob(jobData);
      createdJobIds.push(inferenceId);

      // Notify job queued
      this.wsService.notifyInferenceStatusUpdate(
        userId,
        inferenceId,
        InferenceJobStatus.PENDING,
      );

      await inferenceQueue.add("run", {
        inferenceId: inferenceId,
        goalVideoBuffer: target.file,
        currentVideoBuffer: current.file,
        params: parameters,
      });
    }

    return createdJobIds;
  };

  getInferenceStatus = async (jobId: string): Promise<InferenceJobStatus> => {
    const status = await this.inferenceRepository
      .findById(jobId)
      .then((inference) => {
        if (!inference) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
        return inference.status;
      });
    return status;
  };

  getInferenceJSONResults = async (jobId: string): Promise<object> => {
    const results = await this.resultRepository.getJsonResult(jobId);
    if (!results) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
    return results;
  };

  getInferenceZIPResults = async (jobId: string): Promise<Buffer> => {
    const results = await this.resultRepository.getImageZip(jobId);
    if (!results) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
    return results;
  };

  /**
   * Aggiorna lo stato di un'inferenza (chiamato dal worker)
   */
  async updateInferenceStatus(
    inferenceId: string,
    status: InferenceJobStatus,
    result?: any,
    errorMessage?: string,
    carbonFootprint?: number,
  ): Promise<void> {
    try {
      // Update inference status in database
      await this.inferenceRepository.updateStatus(inferenceId, status);

      // Get inference details to retrieve userId
      const inference = await this.inferenceRepository.findById(inferenceId);
      if (!inference) {
        throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
      }

      // Send WebSocket notification
      this.wsService.notifyInferenceStatusUpdate(
        inference.user_id,
        inferenceId,
        status,
        result,
        errorMessage,
        carbonFootprint,
      );
    } catch (error) {
      console.error(`Error updating inference status ${inferenceId}:`, error);
      throw error;
    }
  }

  private getVideosByRange = async (
    datasetId: string,
    range: string,
  ): Promise<Video[]> => {
    const [startStr, endStr] = range.split("-");
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    if (end < start) {
      throw getError(ErrorEnum.BAD_REQUEST_ERROR).getErrorObj();
    }

    const limit = end - start + 1;
    const offset = start;

    return await this.videoRepository.findByRange(datasetId, offset, limit);
  };
}
