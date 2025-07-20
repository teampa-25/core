import express from "express";
import { createServer } from "http";
import "tsconfig-paths/register"; // required for path aliases like @/*
import "@/models"; // Initialize models and associations
import "@/queue/worker"; // Import worker to initialize it
import routes from "@/routes/routes";
import { morganMiddleware } from "@/config/morgan";
import {
  notFoundHandler,
  errorConverter,
  errorHandler,
} from "@/middlewares/error.middleware";
import { WebSocketService } from "@/services/websocket.service";
import helmet from "helmet";

/**
 * App and Websocket setup
 */
const app = express();
const httpServer = createServer(app);
const wsService = WebSocketService.getInstance();
wsService.initialize(httpServer);

app.use(helmet());
app.use(morganMiddleware);
app.use(express.json());

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);
export default httpServer;
