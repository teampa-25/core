import { Enviroment } from "@/common/types";
import dotenv from "dotenv";

dotenv.config();

/**
 * @description Interface for enviroment variables
 */
const enviroment: Enviroment = {
  nodeEnv: process.env.NODE_ENV || "development",
  apiPort: Number(process.env.API_PORT) || 3000,
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisHost: process.env.REDIS_HOST || "redis",
  fastApiPort: Number(process.env.FASTAPI_PORT) || 8000,
  fastApiHost: process.env.FASTAPI_HOST || "cns",
  postgresPort: Number(process.env.POSTGRES_PORT) || 5432,
  postgresHost: process.env.POSTGRES_HOST || "postgres",
  postgresUser: process.env.POSTGRES_USER || "admin",
  postgresPassword: process.env.POSTGRES_PASSWORD || "admin",
  postgresDB: process.env.POSTGRES_DB || "db",
  jwtPrivateKeyPath:
    process.env.JWT_PRIVATE_KEY_PATH || "../../keys/private.key",
  jwtPublicKeyPath: process.env.JWT_PUBLIC_KEY_PATH || "../../keys/public.key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtAlgorithm: process.env.JWT_ALGORITHM || "RS256",
  saltRounds: Number(process.env.JWT_SALT_ROUNDS) || 10,
};

export default enviroment;
