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
import enviroment from "./config/enviroment";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
/**
 * App and Websocket setup
 */
const app = express();
const httpServer = createServer(app);
const wsService = WebSocketService.getInstance();
wsService.initialize(httpServer);

// Security Middlewares
app.use(helmet());

// Production-specific Middlewares
if (enviroment.nodeEnv === "production") {
  app.use(cors());
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // max IP connections
    }),
  );
}

//Parsing and Logging Middlewares
app.use(express.json());
app.use(morganMiddleware);

app.use("/api", routes);

// Error converting and error handling Middlewares
app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);

export default httpServer;
