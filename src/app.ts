import express from "express";
import routes from "@/routes/v1/routes";
import config from "@/config/config";
import { logger } from "@/config/logger";
import sequelize from "@/config/sequelize";

const app = express();
app.use("/", routes);

const startServer = async () => {
  try {
    // test connection by authentication
    await sequelize.authenticate();
    logger.info("connection to database established successfully.");

    logger.info(
      `api docs on http://localhost:${config.port}/api/${config.apiVersion}/docs`,
    );
    app.listen(config.port);
  } catch (error) {
    logger.error("server can't be started:", error);
    process.exit(1);
  }
};

startServer();
