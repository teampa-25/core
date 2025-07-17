import { User, Video } from "@/models";
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
import { InferenceJobData, InferenceParameters } from "@/common/types";
import { FileSystemUtils } from "@/common/utils/file-system";
import { INFERENCE } from "@/common/const";
import { WebSocketService } from "./websocket.service";
import { logger } from "@/config/logger";

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
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR);

    // Get videos based on range
    const videos =
      range === "all"
        ? await this.videoRepository.findByDatasetId(datasetId)
        : await this.getVideosByRange(datasetId, range);

    if (!videos?.length) throw getError(ErrorEnum.BAD_REQUEST_ERROR);

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
      const abortedJobId =
        await this.inferenceRepository.createInferenceJob(abortedJobData);
      const err = getError(ErrorEnum.INSUFFICIENT_CREDIT).toJSON();

      this.wsService.notifyInferenceStatusUpdate(
        userId,
        abortedJobId,
        InferenceJobStatus.ABORTED,
        err.msg,
      );
      logger.error(`[BullMQ] Job ${abortedJobId} failed: ${err.msg}`);
      throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
    }

    const user = await this.userRepository.deductCredits(userId, inferenceCost);
    if (!user) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }

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

      const inferenceId =
        await this.inferenceRepository.createInferenceJob(jobData);
      createdJobIds.push(inferenceId);

      const inferenceJobData: InferenceJobData = {
        inferenceId,
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

      const inferenceId =
        await this.inferenceRepository.createInferenceJob(jobData);
      createdJobIds.push(inferenceId);

      const inferenceJobData: InferenceJobData = {
        inferenceId: inferenceId,
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
   * Retrieves the inference job status
   * @param jobId The ID of the inference job.
   * @returns the inference job status
   */
  getInferenceStatus = async (jobId: string): Promise<InferenceJobStatus> => {
    logger.info(
      `[InferenceJobService] Getting status for job ${jobId} AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`,
    );
    const inference = await this.inferenceRepository.findById(jobId);
    if (!inference) throw getError(ErrorEnum.NOT_FOUND_ERROR);
    logger.info(
      `[InferenceJobService] Found inference job: ${inference.id} with status ${inference.status} FRAAAAADJDJDJDJDJDDJDJDHDHSDHJSD`,
    );
    return inference.status;
  };

  /**
   * Retrieves the JSON file containing the inference results.
   * @param jobId The ID of the inference job.
   * @returns The JSON file as object.
   */
  getInferenceJSONResults = async (jobId: string): Promise<object> => {
    const results = await this.resultRepository.getJsonResult(jobId);
    if (!results) throw getError(ErrorEnum.NOT_FOUND_ERROR);
    return results;
  };

  /**
   * Retrieves the ZIP file containing the inference results.
   * @param jobId The ID of the inference job.
   * @returns The ZIP file as a Buffer.
   */
  getInferenceZIPResults = async (jobId: string): Promise<Buffer> => {
    const results = await this.resultRepository.getImageZip(jobId);
    if (!results) throw getError(ErrorEnum.NOT_FOUND_ERROR);
    return results;
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

    if (end < start) {
      throw getError(ErrorEnum.BAD_REQUEST_ERROR);
    }

    const limit = end - start + 1;
    const offset = start;

    return await this.videoRepository.findByRange(datasetId, offset, limit);
  };
}
