import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

// Custom format for console (colorized and pretty)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(
    ({ timestamp, level, message, context, trace, ...meta }) => {
      let log = `${timestamp} [${level}]`;

      if (context) {
        log += ` [${context}]`;
      }

      log += ` ${message}`;

      // Add metadata if present
      if (Object.keys(meta).length > 0 && meta.data) {
        log += `\n${JSON.stringify(meta.data, null, 2)}`;
      }

      // Add stack trace for errors
      if (trace) {
        log += `\n${trace}`;
      }

      return log;
    },
  ),
);

// Format for file logging (JSON for easy parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Transport for error logs only
const errorFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  format: fileFormat,
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

// Transport for all logs
const combinedFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  format: fileFormat,
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

// Transport for HTTP logs
const httpFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/http-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'http',
  format: fileFormat,
  maxSize: '20m',
  maxFiles: '7d',
  zippedArchive: true,
});

// Console transport
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
});

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    consoleTransport,
    errorFileTransport,
    combinedFileTransport,
    httpFileTransport,
  ],
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  exitOnError: false,
};
