import { Job, Worker } from "bullmq";
import { redisConnection } from "@/config/redis";
import { InferenceJobProcessor } from "./processor";
import { QUEUE } from "@/common/const";
import "@/queue/queue.events"; // queue events to initialize listeners

/**
 * Worker responsible for processing inference jobs.
 * It listens to the "inferenceJobs" queue and processes each job using the InferenceJobProcessor.
 * The worker is configured with concurrency limits and automatic job execution.
 * @see InferenceJobProcessor
 */
export const inferenceWorker = new Worker(
  "inferenceJobs",
  async (job: Job) => {
    const processor = new InferenceJobProcessor();
    return await processor.processInference(job);
  },
  {
    connection: redisConnection,
    concurrency: QUEUE.MAX_CONCURRENT_JOBS,
    autorun: true,
  },
);
