// src/config/database.ts
import { Sequelize, Dialect } from "sequelize";
import config from "./config";
import { logger } from "./logger";

/**
 * Singleton class to manage Sequelize instance.
 */
class SequelizeInstance {
  private static instance: Sequelize;

  private constructor() {}

  public static getInstance(): Sequelize {
    if (!SequelizeInstance.instance) {
      SequelizeInstance.instance = new Sequelize({
        host: config.dbHost || "localhost",
        port: Number(config.dbPort) || 5432,
        username: config.dbUsername || "postgres",
        password: config.dbPassword || "password",
        database: config.dbName || "InferNode",
        dialect: (config.dbDialect || "postgres") as Dialect,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        logging: config.nodeEnv === "development" ? logger.debug : false,
      });
    }
    return SequelizeInstance.instance;
  }
}

const sequelize = SequelizeInstance.getInstance();
export default sequelize;
