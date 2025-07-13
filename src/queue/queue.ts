import enviroment from "@/config/enviroment";
import { Queue } from "bullmq";
import IORedis from "ioredis";

export const redisConnection = new IORedis({
  host: enviroment.redisHost,
  port: Number(enviroment.redisPort),
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
});

redisConnection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export const inferenceQueue = new Queue("inferenceJop", {
  connection: redisConnection,
});
