import { Video } from "@/models";
import { InferenceJob } from "@/models";
import { inferenceQueue } from "@/queue/queue";
import { DatasetRepository } from "@/repositories/dataset.repository";
import { InferenceJobRepository } from "@/repositories/inference.job.repository";
import { ResultRepository } from "@/repositories/result.repository";
import { UserRepository } from "@/repositories/user.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum, InferenceJobStatus } from "@/common/enums";
import { InferCreationAttributes } from "sequelize";
import {
  CNSResponse,
  InferenceJobData,
  InferenceJobStatusResults,
  InferenceParameters,
} from "@/common/types";
import { FileSystemUtils } from "@/common/utils/file-system";
import { INFERENCE } from "@/common/const";
import { WebSocketService } from "./websocket.service";
import { logger } from "@/config/logger";
import { Job } from "bullmq";

/**
 * Class responsible for handling inference jobs.
 * It provides methods for creating, updating, and managing inference jobs.
 */
export class InferenceJobService {
  private inferenceRepository: InferenceJobRepository;
  private datasetRepository: DatasetRepository;
  private userRepository: UserRepository;
  private videoRepository: VideoRepository;
  private resultRepository: ResultRepository;
  private wsService: WebSocketService = WebSocketService.getInstance();

  constructor() {
    this.inferenceRepository = new InferenceJobRepository();
    this.datasetRepository = new DatasetRepository();
    this.userRepository = new UserRepository();
    this.videoRepository = new VideoRepository();
    this.resultRepository = new ResultRepository();
  }

  /**
   * Enqueues an inference job for a specific user and dataset.
   * @param userId The ID of the user.
   * @param datasetId The ID of the dataset.
   * @param parameters The inference parameters.
   * @param range The range of videos to process.
   * @returns An array of created job IDs.
   */
  public enqueueJob = async (
    userId: string,
    datasetId: string,
    parameters: InferenceParameters,
    range: string,
  ): Promise<string[]> => {
    // Validate dataset exists for user
    await this.datasetRepository.findByIdAndUserId(datasetId, userId);

    // Get videos based on range
    const videos =
      range === "all"
        ? await this.videoRepository.findByDatasetId(datasetId)
        : await this.getVideosByRange(datasetId, range);

    if (videos.length == 0) throw getError(ErrorEnum.EMPTY_DATASET);

    // Sort videos by creation date
    const sorted = videos.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    // Validate all video files exist
    for (const video of sorted) {
      if (!video.file || !FileSystemUtils.fileExists(video.file)) {
        throw getError(ErrorEnum.NOT_FOUND_ERROR);
      }
    }

    // Calculate inference cost
    let inferenceCost = 0;
    if (sorted.length === 1) {
      inferenceCost = sorted[0].frame_count * INFERENCE.COST_OF_INFERENCE;
    } else {
      for (let i = 0; i < sorted.length; i++) {
        inferenceCost += sorted[i].frame_count;
      }
      inferenceCost *= INFERENCE.COST_OF_INFERENCE;
    }

    inferenceCost = Math.ceil(inferenceCost);

    // Check and deduct credits
    const hasCredits = await this.userRepository.hasEnoughCredits(
      userId,
      inferenceCost,
    );
    if (!hasCredits) {
      const abortedJobData = {
        dataset_id: datasetId,
        user_id: userId,
        goal_id: sorted[0].id,
        current_id: sorted[0].id,
        params: parameters,
        status: InferenceJobStatus.ABORTED,
      } as InferCreationAttributes<InferenceJob>;

      //Create aborted job
      const abortedJob =
        await this.inferenceRepository.createInferenceJob(abortedJobData);
      const err = getError(ErrorEnum.INSUFFICIENT_CREDIT).toJSON();

      this.wsService.notifyInferenceStatusUpdate(
        userId,
        abortedJob.id,
        InferenceJobStatus.ABORTED,
        undefined,
        err.msg,
      );
      logger.error(`[BullMQ] Job ${abortedJob.id} failed: ${err.msg}`);
      throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
    }

    await this.userRepository.deductCredits(userId, inferenceCost);

    const createdJobIds: string[] = [];

    // Process single video case
    if (sorted.length === 1) {
      const video = sorted[0];
      const jobData = {
        dataset_id: datasetId,
        user_id: userId,
        goal_id: video.id,
        current_id: video.id,
        params: parameters,
      } as InferCreationAttributes<InferenceJob>;

      const inference =
        await this.inferenceRepository.createInferenceJob(jobData);

      createdJobIds.push(inference.id);

      const inferenceJobData: InferenceJobData = {
        inferenceId: inference.id,
        userId,
        goalVideoPath: video.file,
        currentVideoPath: video.file,
        params: parameters,
      };

      await inferenceQueue.add("run", inferenceJobData);

      return createdJobIds;
    }

    // Process multiple videos
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

      const inference =
        await this.inferenceRepository.createInferenceJob(jobData);
      createdJobIds.push(inference.id);

      const inferenceJobData: InferenceJobData = {
        inferenceId: inference.id,
        userId: userId,
        goalVideoPath: target.file,
        currentVideoPath: current.file,
        params: parameters,
      };

      await inferenceQueue.add("run", inferenceJobData);
    }

    return createdJobIds;
  };

  /**
   * Retrieves the inference job status with results if completed or error if failed
   * @param jobId The ID of the inference job.
   * @returns Object containing status and results if completed or error if failed
   */
  getInferenceStatusWithResults = async (
    jobId: string,
  ): Promise<InferenceJobStatusResults> => {
    const inference = await this.inferenceRepository.findById(jobId);
    const response: InferenceJobStatusResults = { status: inference.status };

    if (inference.status === InferenceJobStatus.COMPLETED) {
      const completedJob = await this.findJobInQueue(jobId, "completed");
      response.results = completedJob?.returnvalue;
    } else if (inference.status === InferenceJobStatus.FAILED) {
      const failedJob = await this.findJobInQueue(jobId, "failed");
      response.failingReason =
        failedJob?.failedReason || "Job failed but no error details available";
    }

    return response;
  };

  /**
   * Retrieves the JSON file containing the inference results.
   * @param jobId The ID of the inference job.
   * @returns The JSON file as CNSResponse.
   */
  getInferenceJSONResults = async (jobId: string): Promise<CNSResponse> => {
    return await this.resultRepository.getJsonResult(jobId);
  };

  /**
   * Retrieves the ZIP file path containing the inference results.
   * @param jobId The ID of the inference job.
   * @returns The ZIP file as a string.
   */
  getInferenceZIPResultsPath = async (jobId: string): Promise<string> => {
    return await this.resultRepository.getImageZipPath(jobId);
  };

  /**
   * Helper method to find a job in the queue by its inference ID
   * @param jobId The inference job ID
   * @param queueType The type of queue to search ('completed' or 'failed')
   * @returns The found job or undefined
   */
  private findJobInQueue = async (
    jobId: string,
    queueType: "completed" | "failed",
  ): Promise<Job | undefined> => {
    const queueJobs: Job[] =
      queueType === "completed"
        ? await inferenceQueue.getCompleted()
        : await inferenceQueue.getFailed();

    return queueJobs.find((job) => job.data.inferenceId === jobId);
  };

  /**
   * Retrieves videos from a dataset within a specific range.
   * @param datasetId The ID of the dataset.
   * @param range The range of video indices to retrieve (e.g., "0-10").
   * @returns An array of videos within the specified range.
   */
  private getVideosByRange = async (
    datasetId: string,
    range: string,
  ): Promise<Video[]> => {
    const [startStr, endStr] = range.split("-");
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    const limit = end - start + 1;
    const offset = start;

    return await this.videoRepository.findByRange(datasetId, offset, limit);
  };
}
