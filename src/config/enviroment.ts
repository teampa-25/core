import dotenv from "dotenv";

dotenv.config();

interface Enviroment{
    nodeEnv: string;
    apiPort: number;
    apiHost: string;
    redisPort: number;
    redisHost: string;
    postgresPort: number;
    postgresHost: string;
    postgresUser: string;
    postgresPassword: string;
    postgresDB: string;
    jwtPrivateKeyPath: string;
    jwtPublicKeyPath: string;
    jwtExpiresIn: string;
    jwtSaltRounds: number;
    maxConcurrentJobs: number;
}

const enviroment: Enviroment = {
    nodeEnv: process.env.NODE_ENV || "development",
    apiPort: Number(process.env.API_PORT) || 3000,
    apiHost: process.env.API_HOST || "app",
    redisPort: Number(process.env.REDIS_PORT) || 6379,
    redisHost: process.env.REDIS_HOST || "redis",
    postgresPort: Number(process.env.POSTGRES_PORT) || 5432,
    postgresHost: process.env.POSTGRES_HOST || "postgres",
    postgresUser: process.env.POSTGRES_USER || "admin",
    postgresPassword: process.env.POSTGRES_PASSWORD || "admin",
    postgresDB: process.env.POSTGRES_DB || "db",
    jwtPrivateKeyPath: process.env.JWT_PRIVATE_KEY_PATH || "../keys/private.key",
    jwtPublicKeyPath: process.env.JWT_PUBLIC_KEY_PATH || "../keys/public.key",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    jwtSaltRounds: Number(process.env.JWT_SALT_ROUNDS) || 10,
    maxConcurrentJobs: Number(process.env.MAX_CONCURRENT_JOBS) || 2
};

export default enviroment;
