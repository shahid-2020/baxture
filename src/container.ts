import { ConfigService } from './common/config';
import { LoggerService } from './common/logger';
import { db } from './database';
import { ErrorMiddleware } from './middlerware/error';
import { RequestLoggerMiddleware } from './middlerware/request-logger';
import { HealthController, HealthService } from './module/health';
import { UserController, UserService } from './module/user';

export const configService = new ConfigService();
export const loggerService = new LoggerService(configService);

export const requestLoggerMiddleware = new RequestLoggerMiddleware(
  loggerService
);
export const errorMiddleware = new ErrorMiddleware(loggerService);

export const healthService = new HealthService();
export const healthController = new HealthController(healthService);

export const userService = new UserService(db);
export const userController = new UserController(userService);
