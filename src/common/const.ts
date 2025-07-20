/**
 * @description Constants for the inference process
 */
const INFERENCE = {
  COST_PER_FRAME: 0.001,
  COST_OF_INFERENCE: 0.002,
  SUPPORTED_VIDEO_FORMATS: ".mp4",
} as const;

/**
 * @description Constants for WebSocket close codes
 */
const WEBSOCKET = {
  POLICY_VIOLATION: 1008,
  NORMAL_CLOSURE: 1000,
} as const;

/**
 * @description Constants for the queue configuration
 */
const QUEUE = {
  MAX_CONCURRENT_JOBS: 2, // max jobs running concurrently
  ATTEMPTS: 3,
  BACKOFF: {
    type: "exponential" as const,
    delay: 2000, // first retry after 2s, then is exponential (2s, 4s, 8s…)
  },
  REMOVE_ON_COMPLETE: {
    age: 3600, // remove completed jobs older than one hour
    count: 1000, // retain up to 1000 completed jobs
  },
  REMOVE_ON_FAIL: {
    age: 86400, // remove failed jobs older than one day
    count: 1000, // retain up to 1000 failed jobs
  },
} as const;

export { INFERENCE, WEBSOCKET, QUEUE };
