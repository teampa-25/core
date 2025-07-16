import express from "express";
import { createServer } from "http";
import "tsconfig-paths/register"; // required for path aliases like @/*
import "@/models"; // Initialize models and associations
import "@/queue/worker"; // Import worker to initialize it

import "@/config/bull-board"; // Import Bull Board configuration
import routes from "@/routes/routes";
import enviroment from "@/config/enviroment";
import { morganMiddleware } from "@/config/morgan";
import {
  notFoundHandler,
  errorConverter,
  errorHandler,
} from "@/middlewares/error.middleware";
import { WebSocketService } from "@/services/websocket.service";
import { logger } from "@/config/logger";
import helmet from "helmet";

const app = express();
const httpServer = createServer(app);

const wsService = WebSocketService.getInstance();
wsService.initialize(httpServer);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);

httpServer.listen(enviroment.apiPort, () => {
  logger.info(`Server running on port ${enviroment.apiPort}`);
  logger.info(
    `API Documentation: http://localhost:${enviroment.apiPort}/api/docs`,
  );
  logger.info(
    `Health Check: http://localhost:${enviroment.apiPort}/api/health`,
  );
  logger.info("WebSocket server initialized");
  logger.info("BullMQ worker initialized and listening for jobs");
});
