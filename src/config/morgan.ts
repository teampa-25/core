import morgan, { StreamOptions } from "morgan";
import { logger } from "./logger";

/**
 * Morgan middleware for logging HTTP requests.
 */
const format =
  ":remote-addr :method :url :status :res[content-length] - :response-time ms";

const stream: StreamOptions = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export const morganMiddleware = morgan(format, { stream });
