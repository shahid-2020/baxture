import bunyan from 'bunyan';

import { ConfigService } from '../config';

export class LoggerService {
  private logger: bunyan;

  constructor(configService: ConfigService) {
    this.logger = bunyan.createLogger({
      name: `baxture_${configService.get('NODE_ENV')}`,
    });
  }

  info(message: string, context?: unknown): void {
    if (context) {
      return this.logger.info(context, message);
    }
    return this.logger.info(message);
  }

  warn(message: string, context?: unknown): void {
    if (context) {
      return this.logger.warn(context, message);
    }
    return this.logger.warn(message);
  }

  error(message: string, context?: unknown): void {
    if (context) {
      return this.logger.error(context, message);
    }
    return this.logger.error(message);
  }
}
