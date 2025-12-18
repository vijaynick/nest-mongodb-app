import { CustomLoggerService } from '../logger/custom-logger.service';

export abstract class BaseService {
  protected abstract readonly logger: CustomLoggerService;
  protected abstract readonly serviceName: string;

  /**
   * Execute method with automatic logging
   */
  protected async executeWithLogging<T>(
    methodName: string,
    operation: () => Promise<T>,
    inputData?: any,
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // Log start
      const inputStr = inputData
        ? ` - Input: ${JSON.stringify(inputData).substring(0, 100)}`
        : '';
      this.logger.debug(`→ ${methodName}${inputStr}`, this.serviceName);

      const result = await operation();
      const duration = Date.now() - startTime;

      // Log success
      this.logger.debug(
        `✓ ${methodName} completed in ${duration}ms`,
        this.serviceName,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log error
      this.logger.error(
        `✗ ${methodName} failed after ${duration}ms: ${error.message}`,
        error.stack,
        this.serviceName,
      );

      throw error;
    }
  }

  /**
   * Execute database operation with logging
   */
  protected async executeQuery<T>(
    queryName: string,
    query: () => Promise<T>,
  ): Promise<T> {
    const startTime = Date.now();
    const result = await query();
    const duration = Date.now() - startTime;
    this.logger.logDatabaseQuery(queryName, duration, this.serviceName);
    return result;
  }

  /**
   * Log business event
   */
  protected logEvent(event: string, data?: any) {
    this.logger.logBusinessEvent(event, data, this.serviceName);
  }

  /**
   * Log warning
   */
  protected logWarn(message: string) {
    this.logger.warn(message, this.serviceName);
  }

  /**
   * Log info
   */
  protected logInfo(message: string, data?: any) {
    if (data) {
      this.logger.logWithData(message, data, this.serviceName);
    } else {
      this.logger.log(message, this.serviceName);
    }
  }

  /**
   * Log debug
   */
  protected logDebug(message: string) {
    this.logger.debug(message, this.serviceName);
  }
}
