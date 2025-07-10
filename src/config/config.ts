import dotenv from "dotenv";
import path from "path";

// Load .env file from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

interface Config {
  port: number;
  nodeEnv: string;
  apiVersion: string;
  jwtPrivateKeyPath: string;
  jwtPublicKeyPath: string;
  jwtAlgorithm: string;
  jwtExpiration: string;
  dbHost: string;
  dbPort: number;
  dbUsername: string;
  dbPassword: string;
  dbName: string;
  dbDialect: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiVersion: process.env.API_VERSION || "v1",
  jwtPrivateKeyPath: process.env.JWT_PRIVATE_KEY_PATH || "./keys/private.key",
  jwtPublicKeyPath: process.env.JWT_PUBLIC_KEY_PATH || "./keys/public.key",
  jwtAlgorithm: process.env.JWT_ALGORITHM || "RS256",
  jwtExpiration: process.env.JWT_EXPIRATION || "24h",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbUsername: process.env.DB_USERNAME || "postgres",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbName: process.env.DB_NAME || "InferNode",
  dbDialect: process.env.DB_DIALECT || "postgres",
};

export default config;
