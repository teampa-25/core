import { parse } from 'path';
import {Sequelize} from 'sequelize';

/**
 * SingletonDBConnection manages a single shared instance of Sequelize for database connection.
 * It implements the Singleton pattern to ensure only one database connection is created
 * during the entire application lifecycle, preventing unnecessary multiple connections.
 * 
 * @class SingletonDBConnection
 * @property {Sequelize} sequelize - The Sequelize instance managing the database connection.
 */

export class SingletonDBConnection {
    private static single_instance: SingletonDBConnection;
    private readonly sequelize: Sequelize;

    private constructor() {
    const db_user = process.env.POSTGRES_USER;
    const db_password = process.env.POSTGRES_PASSWORD;
    const db_name = process.env.POSTGRES_DB;
    const db_host = process.env.POSTGRES_HOST;
    const db_port = Number(process.env.POSTGRES_PORT);

    if (!db_user || !db_password || !db_name || !db_host || !db_port) {
        throw new Error("Missing required environment variables");
    }

    this.sequelize = new Sequelize(db_name, db_user, db_password, {
      host: db_host,
      port: db_port,
      dialect: 'postgres',
      logging: false,
    });
  }
    public static getInstance(): Sequelize {
    if (!SingletonDBConnection.single_instance) {
      SingletonDBConnection.single_instance = new SingletonDBConnection();
    }
    return SingletonDBConnection.single_instance.sequelize;
  }
}