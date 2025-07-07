import express from "express";
import routes from "./routes/v1";
import config from "./config/config";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(compression());
if (config.nodeEnv === "development") app.use(morgan("dev"));
app.use(express.json());

// v1 api routes
app.use(`/api/${config.apiVersion}`, routes);

app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Not Found",
  });
  next();
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
