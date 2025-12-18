import { CustomLoggerService } from '../logger/custom-logger.service';

/**
 * Decorator to automatically log method execution
 */
export function LogMethod(customContext?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const methodName = propertyKey;
    const className = target.constructor.name;
    const logContext = customContext || className;

    descriptor.value = async function (...args: any[]) {
      const logger: CustomLoggerService = this.logger;

      if (!logger) {
        console.warn(`Logger not found in ${className}.${methodName}`);
        return originalMethod.apply(this, args);
      }

      const startTime = Date.now();

      try {
        // Log method start with truncated args
        const argsStr = args
          .map((a) => {
            const str = JSON.stringify(a);
            return str.length > 50 ? str.substring(0, 50) + '...' : str;
          })
          .join(', ');

        logger.debug(`→ ${methodName}(${argsStr})`, logContext);

        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        // Log success
        logger.debug(`✓ ${methodName} completed in ${duration}ms`, logContext);

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        // Log error
        logger.error(
          `✗ ${methodName} failed after ${duration}ms: ${error.message}`,
          error.stack,
          logContext,
        );

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Decorator for business events
 */
export function LogBusinessEvent(eventName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      const logger: CustomLoggerService = this.logger;

      const result = await originalMethod.apply(this, args);

      if (logger) {
        // Extract meaningful data from result
        const eventData =
          typeof result === 'object' && result !== null
            ? {
                id: result._id || result.id,
                name: result.name,
                email: result.email,
              }
            : {};

        logger.logBusinessEvent(eventName, eventData, className);
      }

      return result;
    };

    return descriptor;
  };
}
