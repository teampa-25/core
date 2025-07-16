import { QUEUE } from "@/common/const";
import enviroment from "@/config/enviroment";
import { logger } from "@/config/logger";
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
  logger.info("Redis connection established successfully");
});

redisConnection.on("error", (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

redisConnection.on("close", () => {
  logger.warn("Redis connection closed");
});

redisConnection.on("reconnecting", () => {
  logger.info("Redis reconnecting...");
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
