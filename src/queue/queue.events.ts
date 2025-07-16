import { QueueEvents } from "bullmq";
import { inferenceQueue } from "./queue";
import { redisConnection } from "@/config/redis";
import { logger } from "@/config/logger";
import { InferenceJobRepository } from "@/repositories/inference.job.repository";
import { WebSocketService } from "@/services/websocket.service";
import { InferenceJobStatus } from "@/common/enums";

/**
 * Queue events for inference jobs
 */
const queueEvents = new QueueEvents("inferenceJobs", {
  connection: redisConnection,
});

const wsService = WebSocketService.getInstance();
const inferenceRepo = new InferenceJobRepository();

/**
 * WAITING: Job is waiting for a worker to become available
 * ACTIVE: Job is being processed by a worker
 * COMPLETED: Job has been completed
 * FAILED: Job has failed
 *
 * each events update inference job status in db and notify the user via websocket
 */
queueEvents.on("waiting", async ({ jobId }) => {
  const job = await inferenceQueue.getJob(jobId);
  if (!job) return;

  const { inferenceId, userId } = job.data;
  await inferenceRepo.updateStatus(inferenceId, InferenceJobStatus.PENDING);
  wsService.notifyInferenceStatusUpdate(
    userId,
    inferenceId,
    InferenceJobStatus.PENDING,
  );

  logger.info(`[BullMQ] Job ${jobId} pending`);
});

queueEvents.on("active", async ({ jobId }) => {
  const job = await inferenceQueue.getJob(jobId);
  if (!job) return;

  const { inferenceId, userId } = job.data;
  await inferenceRepo.updateStatus(inferenceId, InferenceJobStatus.RUNNING);
  wsService.notifyInferenceStatusUpdate(
    userId,
    inferenceId,
    InferenceJobStatus.RUNNING,
  );

  logger.info(`[BullMQ] Job ${jobId} running`);
});

queueEvents.on("completed", async ({ jobId }) => {
  const job = await inferenceQueue.getJob(jobId);
  if (!job) return;

  const { inferenceId, userId } = job.data;
  await inferenceRepo.updateStatus(inferenceId, InferenceJobStatus.COMPLETED);
  wsService.notifyInferenceStatusUpdate(
    userId,
    inferenceId,
    InferenceJobStatus.COMPLETED,
  );

  logger.info(`[BullMQ] Job ${jobId} completed`);
});

queueEvents.on("failed", async ({ jobId, failedReason }) => {
  const job = await inferenceQueue.getJob(jobId);
  if (!job) return;

  const { inferenceId, userId } = job.data;
  await inferenceRepo.updateStatus(inferenceId, InferenceJobStatus.FAILED);
  wsService.notifyInferenceStatusUpdate(
    userId,
    inferenceId,
    InferenceJobStatus.FAILED,
    undefined,
    failedReason,
  );

  logger.error(`[BullMQ] Job ${jobId} failed: ${failedReason}`);
});
