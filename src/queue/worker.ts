import { Job, Worker } from "bullmq";
import { redisConnection } from "./queue";
import { InferenceJobProcessor } from "./processor";
import enviroment from "@/config/enviroment";

const MAX_CONCURRENT_JOBS = enviroment.maxConcurrentJobs;

export const inferenceWorker = new Worker(
  'inference',
  async (job: Job) => {
    const processor = new InferenceJobProcessor();
    return await processor.processInference(job);
  },
  {
    connection: redisConnection,
    concurrency: Number(MAX_CONCURRENT_JOBS),
  }
);

inferenceWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completato`);
});

inferenceWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} fallito:`, err);
});

inferenceWorker.on('stalled', (jobId) => {
  console.warn(`Job ${jobId} bloccato`);
});

inferenceWorker.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progresso: ${progress}%`);
});