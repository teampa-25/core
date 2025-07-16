import { Detector } from "@/common/enums";

/**
 * @description Interface for video information
 */
interface VideoInfo {
  frameCount: number;
  duration: number;
  width: number;
  height: number;
  frameRate: number;
}

/**
 * @description User info per JWT Payload
 */
interface UserPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * @description Interface object for validation middleware
 */
interface ValidationError {
  field: string;
  message: string;
  value?: any;
  type: string;
}

/**
 * @description Interface object for the response coming from the model CNS
 */
interface CNSResponse {
  requestId: string;
  velocity: number[][];
  carbon_footprint: number;
  download_url: string;
  message: string;
}

/**
 * @description Interface for inference parameters
 */
interface InferenceParameters {
  startFrame: number;
  endFrame: number;
  frameStep: number;
  goalFrameId: number;
  detector: Detector;
  useGpus: boolean;
}

/**
 * @description Interface for WebSocket notification data
 */
interface WebSocketNotification {
  type: string;
  data: {
    inferenceId: string;
    status: string;
    result?: any;
    errorMessage?: string;
  };
  timestamp: Date;
}

/**
 * @description Interface to map env variables.
 */
interface Enviroment {
  nodeEnv: string;
  apiPort: number;
  redisPort: number;
  redisHost: string;
  fastApiPort: number;
  fastApiHost: string;
  postgresPort: number;
  postgresHost: string;
  postgresUser: string;
  postgresPassword: string;
  postgresDB: string;
  jwtPrivateKeyPath: string;
  jwtPublicKeyPath: string;
  jwtExpiresIn: string;
  jwtAlgorithm: string;
  saltRounds: number;
  maxConcurrentJobs: number;
  resultsBasePath: string;
}

export {
  VideoInfo,
  UserPayload,
  ValidationError,
  CNSResponse,
  InferenceParameters,
  WebSocketNotification,
  Enviroment,
};
