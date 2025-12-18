import {
  Injectable,
  LogLevel,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class CustomLoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom methods for structured logging
  logWithData(message: string, data: any, context?: string) {
    this.logger.info(message, { context, data });
  }

  logHttpRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ) {
    this.logger.http(`${method} ${url}`, {
      context: 'HTTP',
      statusCode,
      duration: `${duration}ms`,
    });
  }

  logDatabaseQuery(query: string, duration: number, context?: string) {
    this.logger.debug(`Database query: ${query}`, {
      context: context || 'Database',
      duration: `${duration}ms`,
    });
  }

  logBusinessEvent(event: string, data?: any, context?: string) {
    this.logger.info(`Business Event: ${event}`, {
      context: context || 'Business',
      data,
    });
  }
}
