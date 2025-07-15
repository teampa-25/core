import { Video } from "@/models";
import { InferenceJob } from "@/models";
import { Result } from "@/models";
import { inferenceQueue } from "@/queue/queue";
import { DatasetRepository } from "@/repositories/dataset.repository";
import { InferenceJobRepository } from "@/repositories/inference.job.repository";
import { ResultRepository } from "@/repositories/result.repository";
import { UserRepository } from "@/repositories/user.repository";
import { VideoRepository } from "@/repositories/video.repository";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum, InferenceJobStatus } from "@/common/enums";
import { INFERENCE } from "@/common/const";
import { InferCreationAttributes } from "sequelize";
import { CNSResponse, InferenceParameters } from "@/common/types";

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

  constructor() {
    this.inferenceRepository = new InferenceJobRepository();
    this.datasetRepository = new DatasetRepository();
    this.userRepository = new UserRepository();
    this.videoRepository = new VideoRepository();
    this.resultRepository = new ResultRepository();
  }

  /**
   * Create and enqueue inference jobs
   * @param userId the ID of the dataset owner
   * @param datasetId the ID of the dataset to use in inference
   * @param parameters the inference parameters
   * @param range the dataset partition to use
   * @returns list of jobs ids
   */
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

      await inferenceQueue.add("run", {
        inferenceId: inferenceId,
        goalVideoBuffer: target.file,
        currentVideoBuffer: current.file,
        params: parameters,
      });
    }

    return createdJobIds;
  };

  /**
   * Retrieves the inference job status
   * @param jobId The ID of the inference job.
   * @returns the inference job status
   */
  getInferenceStatus = async (jobId: string): Promise<InferenceJobStatus> => {
    const status = await this.inferenceRepository
      .findById(jobId)
      .then((inference) => {
        if (!inference) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
        return inference.status;
      });
    return status;
  };

  /**
   * Retrieves the JSON file containing the inference results.
   * @param jobId The ID of the inference job.
   * @returns The JSON file as object.
   */
  getInferenceJSONResults = async (jobId: string): Promise<object> => {
    const results = await this.resultRepository.getJsonResult(jobId);
    if (!results) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
    return results;
  };

  /**
   * Retrieves the ZIP file containing the inference results.
   * @param jobId The ID of the inference job.
   * @returns The ZIP file as a Buffer.
   */
  getInferenceZIPResults = async (jobId: string): Promise<Buffer> => {
    const results = await this.resultRepository.getImageZip(jobId);
    if (!results) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
    return results;
  };

  /**
   * Updates the status of an inference job.
   * @param inferenceId The ID of the inference job.
   * @param status The new status of the inference job.
   * @param result The result of the inference job (if completed).
   * @param errorMessage The error message (if failed or aborted).
   */
  async updateInferenceStatus(
    inferenceId: string,
    status: InferenceJobStatus,
    result?: CNSResponse,
    errorMessage?: string,
  ): Promise<void> {
    await this.inferenceRepository.updateStatus(inferenceId, status);

    const inference = await this.inferenceRepository.findById(inferenceId);
    // if (inference) {
    //   this.wsService.notifyUser(inference.user_id, {
    //     type: 'INFERENCE_STATUS_UPDATE',
    //     data: {
    //       inferenceId,
    //       status,
    //       result: status === InferenceJobStatus.COMPLETED ? result : undefined,
    //       errorMessage,
    //     },
    //     timestamp: new Date()
    //   });
    // }
  }

  /**
   * Allows to take specific partions of a dataset.
   * @param datasetId
   * @param range
   * @returns list of videos in the specified range
   */
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
