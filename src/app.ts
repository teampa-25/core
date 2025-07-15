import express from "express";
import "tsconfig-paths/register"; // required for path aliases like @/*
import "@/models"; // Initialize models and associations
import routes from "@/routes/routes";
import enviroment from "@/config/enviroment";
import { morganMiddleware } from "@/config/morgan";
import {
  notFoundHandler,
  errorConverter,
  errorHandler,
} from "@/middlewares/error.middleware";
import { logger } from "@/config/logger";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(morganMiddleware);
app.use(express.json());

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);

// Initialize WebSocket service

app.listen(enviroment.apiPort, () => {
  logger.info(`Server running on port ${enviroment.apiPort}`);
  logger.info(
    `API Documentation: http://localhost:${enviroment.apiPort}/api/docs`,
  );
  logger.info(
    `Health Check: http://localhost:${enviroment.apiPort}/api/health`,
  );
});
