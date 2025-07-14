import { InferenceJobStatus } from "@/models/enums/inference.job.status";
import { Result } from "@/models/result";
import { inferenceQueue } from "@/queue/queue";
import { DatasetRepository } from "@/repositories/dataset.repository";
import { UserRepository } from "@/repositories/user.repository";
import { ErrorEnum, getError } from "@/utils/api-error";
import { INFERENCE } from "@/utils/const";

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
  // private inferenceRepository: InferenceRepository;
  private datasetRepository: DatasetRepository;
  private userRepository: UserRepository;
  // private wsService: WebSocketService;

  constructor() {
    //     this.inferenceRepository = new InferenceRepository();
    this.datasetRepository = new DatasetRepository();
    this.userRepository = new UserRepository();
    //     this.wsService = WebSocketService.getInstance();
  }

  getInferenceStatus = async (jobId: string): Promise<InferenceJobStatus> => {
    //return await this.repo
    return InferenceJobStatus.ABORTED;
  };

  getInferenceJSONResults = async (jobId: string): Promise<void> => {
    //return await this.repo
  };

  getInferenceZIPResults = async (jobId: string): Promise<void> => {
    //return await this.repo
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
