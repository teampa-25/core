import { Job } from 'bullmq';
import { InferenceJobService } from '../services/inference-job.service';
import { InferenceJobStatus } from '@/models/enums/inference.job.status';

export class InferenceJobProcessor {
  private inferenceJobService: InferenceJobService;

  constructor() {
    this.inferenceJobService = new InferenceJobService();
  }

  async processInference(job: Job): Promise<void> {
    const { inferenceId, userId, datasetId, modaelId, parameters, videos } = job.data;

    try {
     
      await this.inferenceJobService.updateInferenceStatus(inferenceId, InferenceJobStatus.RUNNING);
      
     
      //do inference
      //const resultJson = axios.post("http://localhost:8000/analyze");
      //const resultZip = axios.get(resultJson.zipDownload);
     
      await this.inferenceJobService.updateInferenceStatus(
        inferenceId,
        InferenceJobStatus.COMPLETED
      );

    } catch (error) {
      console.error(`Errore durante inferenza ${inferenceId}:`, error);
    
      await this.inferenceJobService.updateInferenceStatus(
        inferenceId,
        InferenceJobStatus.FAILED
      );

      throw error;
    }
  }
}