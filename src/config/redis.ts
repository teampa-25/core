import IORedis from "ioredis";
import enviroment from "@/config/enviroment";
import { logger } from "@/config/logger";

/**
 * Redis connection for BullMQ
 */
export const redisConnection = new IORedis({
  host: enviroment.redisHost,
  port: Number(enviroment.redisPort),
  maxRetriesPerRequest: null,
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
