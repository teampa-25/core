import { QUEUE } from "@/common/const";
import { redisConnection } from "@/config/redis";
import { Queue } from "bullmq";

/**
 * Queue for inference jobs with proper configuration
 * @see QUEUE object in const.ts
 */
export const inferenceQueue = new Queue("inferenceJobs", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: QUEUE.ATTEMPTS,
    backoff: QUEUE.BACKOFF,
    removeOnComplete: QUEUE.REMOVE_ON_COMPLETE,
    removeOnFail: QUEUE.REMOVE_ON_FAIL,
  },
});
