import { Sequelize } from "sequelize";
import enviroment from "@/config/enviroment";
/**
 * Database connection
 *
 * @class Database
 * @property {Sequelize} sequelize - The Sequelize instance managing the database connection.
 */

export class Database {
  private static instance: Database;
  private readonly sequelize: Sequelize;

  private constructor() {
    // NOTE: false fallback value is used to ensure that if one of them
    // is missing, the following if statement will throw an error
    // (i dont like undefined values honestly, hard to understand why they exist)
    // -beg
    const db_user = enviroment.postgresUser;
    const db_password = enviroment.postgresPassword;
    const db_name = enviroment.postgresDB;
    const db_host = enviroment.postgresHost;
    const db_port = enviroment.postgresPort;

    // if (!db_user || !db_password || !db_name || !db_host || !db_port) {
    //   throw new Error("Missing required environment variables");
    // }

    // NOTE: this hard ties the object to postgres!
    // what if someone decides to use something else?
    // should we let them do it?
    // -beg
    this.sequelize = new Sequelize(db_name, db_user, db_password, {
      host: db_host,
      port: Number(db_port),
      dialect: "postgres",
      //logging: db_logging,
    });
  }

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance.sequelize;
  }
}
