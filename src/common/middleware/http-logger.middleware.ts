import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;

    // Log incoming request
    this.logger.log(`→ ${method} ${originalUrl} - IP: ${ip}`, 'HTTP Request');

    // Capture response
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      // Choose log level based on status code
      if (statusCode >= 500) {
        this.logger.error(
          `← ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
          undefined,
          'HTTP Response',
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `← ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
          'HTTP Response',
        );
      } else {
        this.logger.logHttpRequest(method, originalUrl, statusCode, duration);
      }
    });

    next();
  }
}
