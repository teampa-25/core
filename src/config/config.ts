import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  apiVersion?: string;
  dbHost?: string;
  dbPort?: number;
  dbUsername?: string;
  dbPassword?: string;
  dbName?: string;
  dbDialect?: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  apiVersion: process.env.API_VERSION || "1.0.0",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbUsername: process.env.DB_USERNAME || "postgres",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbName: process.env.DB_NAME || "InferNode",
  dbDialect: process.env.DB_DIALECT || "postgres",
};

export default config;
