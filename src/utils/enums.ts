/**
 * Enum for User roles
 */
export enum Role {
  ADMIN = "admin",
  USER = "user",
}

/**
 * Enum for InferenceJob status
 */
export enum InferenceJobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  ABORTED = "ABORTED",
  COMPLETED = "COMPLETED",
}

/**
 * Enum for Error types
 */
export enum ErrorEnum {
  None,
  NotFound,
  Generic,
  Forbidden,
  Unauthorized,
  BadRequest,
  InsufficientCredits,
  DatasetNameConflict,
  InvalidFileFormat,
  InternalServer,
}
