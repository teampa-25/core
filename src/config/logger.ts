
import winston, { format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import appRoot from "app-root-path";
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

export const logger = winston.createLogger({
  level: enviroment.nodeEnv === "production" ? "info" : "debug",
  transports: [
    new transports.Console({ format: consoleFormat }),
    new DailyRotateFile({
      dirname: `${appRoot}/logs`,
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "info",
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});
