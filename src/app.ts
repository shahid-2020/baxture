import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';

import * as container from './container';

export function createApp() {
  const app = express();
  const rateLimiter = rateLimit({
    max: 60, // Limit each IP to 60 requests per `window` (here, per 1 second)
    windowMs: 60 * 1000, // 1 sec
    message: 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(rateLimiter);
  app.use(express.json({ limit: '5mb' }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(helmet());
  app.use(hpp({ whitelist: [] }));
  app.use(container.requestLoggerMiddleware.use);

  app.use('/health', container.healthController.routes());
  app.use('/api/v1/users', container.userController.routes());

  app.use([
    container.errorMiddleware.routeNotFound,
    container.errorMiddleware.processError,
  ]);

  return app;
}
