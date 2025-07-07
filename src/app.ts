import express from "express";
import routes from "./routes/v1";
import config from "./config/config";
import helmet from "helmet";
import compression from "compression";
import { morganMiddleware } from "./config/morgan";
import { logger } from "./config/logger";
//import "./@types/CustomUser"; // Import to extend Express Request type
const app = express();

app.use(helmet());
app.use(express.json());
if (config.nodeEnv === "development") app.use(morganMiddleware);

app.use(compression());

// v1 api routes
app.use(`/api/${config.apiVersion}`, routes);

app.use((req, res, next) => {
  logger.error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    status: "fail",
    message: "Not Found",
  });
  next();
});

app.listen(config.port, () => {
  logger.info(`🚀 Server running on http://localhost:${config.port}`);
});
