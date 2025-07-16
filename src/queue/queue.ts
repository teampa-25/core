import { QUEUE } from "@/common/const";
import enviroment from "@/config/enviroment";
import { Queue } from "bullmq";
import IORedis from "ioredis";

/**
 * Redis connection for BullMQ
 */
export const redisConnection = new IORedis({
  host: enviroment.redisHost,
  port: Number(enviroment.redisPort),
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
});

redisConnection.on("ready", () => {
  console.log("Redis connection ready");
});

redisConnection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

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
