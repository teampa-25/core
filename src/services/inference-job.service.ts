import { InferenceJobStatus } from "@/models/enums/inference.job.status";
import { inferenceQueue } from "@/queue/queue";

enum Detector{
    akaze = "AKAZE",
    sift = "SIFT",
    orb = "ORB"
}

interface InferenceParameters{
    startFrame: number,
    endFrame: number,
    frameStep: number,
    detector: Detector,
    useDevice: boolean
}


export class InferenceJobService{
    // private inferenceRepository: InferenceRepository;
    // private datasetRepository: DatasetRepository;
    // private userRepository: UserRepository;
    // private wsService: WebSocketService;

    // constructor() {
    //     this.inferenceRepository = new InferenceRepository();
    //     this.datasetRepository = new DatasetRepository();
    //     this.userRepository = new UserRepository();
    //     this.wsService = WebSocketService.getInstance();
    // }

    enqueueJob = async (
        userId: string,
        datasetId: string,
        modelId: string,
        parameters: InferenceParameters
    ): Promise<string> => {
        //check datasetid calling dataset repo

        //check userid calling user repo

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
        return "HI"
    }


    /**
   * Aggiorna lo stato di un'inferenza (chiamato dal worker)
   */
  async updateInferenceStatus(
    inferenceId: string, 
    status: InferenceJobStatus,
    result?: any,
    errorMessage?: string,
    carbonFootprint?: number
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