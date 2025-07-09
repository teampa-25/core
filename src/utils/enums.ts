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
