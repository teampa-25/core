import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
});

redisConnection.on('error', err => {
    console.error('Redis connection error:', err);
});


export const inferenceQueue = new Queue("inferenceJop", { connection: redisConnection });
