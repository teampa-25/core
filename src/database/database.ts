import { Sequelize } from "sequelize";
import enviroment from "@/config/enviroment";
import { logger } from "@/config/logger";

/**
 * Database connection manager using Sequelize.
 * @class Database
 * @property {Sequelize} sequelize - The Sequelize instance managing the database connection.
 */
export class Database {
  private static instance: Database;
  private readonly sequelize: Sequelize;

  private constructor() {
    const dbUser = enviroment.postgresUser;
    const dbPassword = enviroment.postgresPassword;
    const dbName = enviroment.postgresDB;
    const dbHost = enviroment.postgresHost;
    const dbPort = enviroment.postgresPort;

    this.sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: Number(dbPort),
      dialect: "postgres",
      logging: (msg) => logger.debug(`[Sequelize] ${msg}`),
    });
  }

  /**
   * Get the singleton instance of the Database class.
   * @returns {Sequelize} The Sequelize instance managing the database connection.
   */
  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance.sequelize;
  }
}
