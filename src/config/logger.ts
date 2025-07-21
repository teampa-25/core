import winston, { format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import enviroment from "./enviroment";

/**
 * Logger configuration using Winston.
 * This configuration sets up different logging formats for console and file transports.
 * It includes timestamps, metadata, and colorization for console output.
 * The file transport uses daily rotation to manage log files.
 */

const { combine, timestamp, printf, metadata, colorize } = format;

const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
);

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
);

/**
 * Winston logger instance with different transports based on the environment.
 * The logger level is set to 'info' in production, and 'debug' in development.
 * The transports include console and file transports with different configurations.
 * The 'exitOnError' option is set to false to prevent the process from exiting on error.
 * @porperty maxFiles is used to retain rotated log files for n days, automatically deleting older ones
 */
export const logger = winston.createLogger({
  level: enviroment.nodeEnv === "production" ? "info" : "debug",
  transports: [
    new transports.Console({ format: consoleFormat }),
    new DailyRotateFile({
      dirname: "./logs",
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "info",
      format: fileFormat,
    }),
    new DailyRotateFile({
      dirname: "./logs",
      filename: "jobs-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      level: "info",
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});
