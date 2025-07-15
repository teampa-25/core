import { Detector } from "@/common/enums";

interface VideoInfo {
  frameCount: number;
  duration: number;
  width: number;
  height: number;
  frameRate: number;
}

/**
 * User info per JWT Payload
 */
interface UserPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Interface object for validation middleware
 */
interface ValidationError {
  field: string;
  message: string;
  value?: any;
  type: string;
}

/**
 * Interface object for the response coming from the model CNS
 */
interface CNSResponse {
  requestId: string;
  velocity: number[][];
  carbon_footprint: number;
  download_url: string;
  message: string;
}

/**
 * Interface for inference parameters
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
 * Interface for WebSocket notification data
 */
interface WebSocketNotification {
  type: string;
  data: {
    inferenceId: string;
    status: string;
    result?: any;
    errorMessage?: string;
    carbonFootprint?: number;
  };
  timestamp: Date;
}

/**
 * Interface to map env variables.
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
