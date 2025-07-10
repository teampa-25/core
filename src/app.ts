import express from "express";
import { Request, Response, NextFunction } from "express";
import routes from "./routes/v1";
import config from "./config/config";
import helmet from "helmet";
import compression from "compression";
import { morganMiddleware } from "./config/morgan";
import { logger } from "./config/logger";
import sequelize from "./config/sequelize";
import { StatusCodes } from "http-status-codes";
//import "./@types/CustomUser"; // Import to extend Express Request type

const app = express();

app.use(helmet());
if (config.nodeEnv === "development") app.use(morganMiddleware);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// v1 api routes
app.use(`/api/${config.apiVersion}`, routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.error(`Not Found - ${req.originalUrl}`);
  res.status(StatusCodes.NOT_FOUND).json({
    status: "fail",
    message: "Not Found",
  });
  next();
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully.");

    // Sync database models
    await sequelize.sync({ alter: config.nodeEnv === "development" });
    logger.info("Database models synchronized.");

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(
        `API Documentation: http://localhost:${config.port}/api/${config.apiVersion}/docs`,
      );
      logger.info(
        `Health Check: http://localhost:${config.port}/api/${config.apiVersion}/health`,
      );
    });
  } catch (error) {
    logger.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
