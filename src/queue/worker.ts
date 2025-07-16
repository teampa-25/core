import { Job, Worker } from "bullmq";
import { redisConnection } from "./queue";
import { InferenceJobProcessor } from "./processor";
import { CNSResponse } from "@/common/types";
import { logger } from "@/config/logger";
import { QUEUE } from "@/common/const";
import { WebSocketService } from "@/services/websocket.service";
import { InferenceJobStatus } from "@/common/enums";

const wsService = WebSocketService.getInstance();

export const inferenceWorker = new Worker(
  "inferenceJobs",
  async (job: Job) => {
    logger.debug("Starting inference job", {
      jobId: job.id,
      userId: job.data.userId,
      payload: job.data,
    });
    const processor = new InferenceJobProcessor();
    return await processor.processInference(job);
  },
  {
    connection: redisConnection,
    concurrency: QUEUE.MAX_CONCURRENT_JOBS,
    autorun: true,
  },
);

inferenceWorker.on("active", (job: Job) => {
  logger.info("Job RUNNING", {
    jobId: job.id,
    userId: job.data.userId,
    payload: job.data,
  });

  wsService.notifyInferenceStatusUpdate(
    job.data.userId,
    job.id!,
    InferenceJobStatus.RUNNING,
  );
});

inferenceWorker.on("completed", (job: Job, result: CNSResponse) => {
  logger.info("Job COMPLETED", {
    jobId: job.id,
    userId: job.data.userId,
  });

  wsService.notifyInferenceStatusUpdate(
    job.data.userId,
    job.id!,
    InferenceJobStatus.COMPLETED,
    result,
  );
});

inferenceWorker.on("failed", (job, err) => {
  if (!job) {
    logger.error("Job FAILED but job object is undefined", {
      error: err.message,
    });
    return;
  }
  logger.error("Job FAILED", {
    jobId: job.data.id,
    userId: job.data.userId,
    error: err.message,
    stack: err.stack,
  });

  wsService.notifyInferenceStatusUpdate(
    job.data.userId,
    job.id!,
    InferenceJobStatus.FAILED,
    err.message,
  );
});
