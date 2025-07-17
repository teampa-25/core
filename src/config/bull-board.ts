import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { inferenceQueue } from "@/queue/queue";
import { logger } from "@/config/logger";

/**
 * Bull board server adapter to be used in the express app
 */
const serverAdapter = new ExpressAdapter();

/**
 * Bull board configuration
 */
createBullBoard({
  queues: [new BullMQAdapter(inferenceQueue)],
  serverAdapter,
});

export { serverAdapter };
