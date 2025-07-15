import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { inferenceQueue } from "@/queue/queue";

/**
 * Bull board server adapter to be used in the express app
 */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("admin/queues");

/**
 * Bull board configuration
 */
createBullBoard({
  queues: [new BullMQAdapter(inferenceQueue)],
  serverAdapter,
});

export { serverAdapter };
