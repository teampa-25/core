/**
 * @description Enum for ErrorFactory Object
 */
enum ErrorEnum {
  GENERIC_ERROR = "GENERIC_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  NOT_FOUND_ROUTE_ERROR = "NOT_FOUND_ROUTE_ERROR",
  FORBIDDEN_ERROR = "FORBIDDEN_ERROR",
  UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
  BAD_REQUEST_ERROR = "BAD_REQUEST_ERROR",
  DATASET_NAME_CONFLICT_ERROR = "DATASET_NAME_CONFLICT_ERROR",
  CONFLICT_ERROR = "CONFLICT_ERROR",
  INVALID_FILE_FORMAT_ERROR = "INVALID_FILE_FORMAT_ERROR",
  INVALID_JWT_FORMAT = "INVALID_JWT_FORMAT",
  NOT_IMPLEMENTED_ERROR = "NOT_IMPLEMENTED_ERROR",
  IM_A_TEAPOT = "IM_A_TEAPOT",
  INSUFFICIENT_CREDIT = "INSUFFICIENT_CREDIT",
}

/**
 * @description Enum for detector to use inference-time
 */
enum Detector {
  AKAZE = "AKAZE",
  SIFT = "SIFT",
  ORB = "ORB",
}

/**
 * @description Enum for user's role
 */
enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

/**
 * @description Enum for inference job status
 */
enum InferenceJobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  ABORTED = "ABORTED",
  COMPLETED = "COMPLETED",
}

export { ErrorEnum, Detector, UserRole, InferenceJobStatus };
