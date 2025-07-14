import { InferenceJobStatus } from "@/models/enums/inference.job.status";
import { Result } from "@/models";
import { inferenceQueue } from "@/queue/queue";
import { DatasetRepository } from "@/repositories/dataset.repository";
import { InferenceJobRepository } from "@/repositories/inference.job.repository";
import { ResultRepository } from "@/repositories/result.repository";
import { UserRepository } from "@/repositories/user.repository";
import { ErrorEnum, getError } from "@/utils/api-error";
import { INFERENCE } from "@/utils/const";
import { th } from "@faker-js/faker/.";

enum Detector {
  akaze = "AKAZE",
  sift = "SIFT",
  orb = "ORB",
}

interface InferenceParameters {
  startFrame: number;
  endFrame: number;
  frameStep: number;
  detector: Detector;
  useDevice: boolean;
}

export class InferenceJobService {
  private inferenceRepository: InferenceJobRepository;
  private datasetRepository: DatasetRepository;
  private userRepository: UserRepository;
  private resultRepository: ResultRepository;
  // private wsService: WebSocketService;

  constructor() {
    this.inferenceRepository = new InferenceJobRepository();
    this.datasetRepository = new DatasetRepository();
    this.userRepository = new UserRepository();
    this.resultRepository = new ResultRepository();
    //     this.wsService = WebSocketService.getInstance();
  }

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

  enqueueJob = async (
    userId: string,
    datasetId: string,
    parameters: InferenceParameters,
  ): Promise<string> => {
    const dataset = await this.datasetRepository.findByIdAndUserId(
      datasetId,
      userId,
    );
    if (!dataset) throw getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();

    // const requiredCredits = totalFrames * INFERENCE.COST_OF_INFERENCE;
    // const userCredits = await this.userRepository.hasEnoughCredits(userId, );)
    //calculate inferenc cost and update user credits
    //this.wsService.notifyUser(userId, {
    //     type: 'INFERENCE_STATUS_UPDATE',
    //     data: {
    //         inferenceId: inference.id,
    //         status: InferenceJobStatus.ABORTED,
    //         message: 'Inferenza aggiunta alla coda'
    //     },
    //     timestamp: new Date()
    // });

    //create inferenceJob

    // const inference = await this.inferenceRepository.create({
    //     id: uuidv4(),
    //     userId,
    //     datasetId,
    //     videoId,
    //     status: InferenceJobStatus.PENDING,
    //     parameters,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // });

    //await inferenceQueue.add('inference', { //data to be passed to the worker}, {options});

    // Notifica via WebSocket
    // this.wsService.notifyUser(userId, {
    //     type: 'INFERENCE_STATUS_UPDATE',
    //     data: {
    //         inferenceId: inference.id,
    //         status: InferenceJobStatus.PENDING,
    //         message: 'Inferenza aggiunta alla coda'
    //     },
    //     timestamp: new Date()
    // });

    // return inference;
    return "HI";
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
    // const updateData: any = { status, updatedAt: new Date() };
    // await this.inferenceRepository.update(updateData, { where: { id: inferenceId } });
    // this.wsService.notifyUser(inference.userId, {
    //     type: 'INFERENCE_STATUS_UPDATE',
    //     data: {
    //         inferenceId,
    //         status,
    //         result: status === 'COMPLETED' ? result : undefined,
    //         errorMessage,
    //         carbonFootprint
    //     },
    //     timestamp: new Date()
    // });
  }
}
