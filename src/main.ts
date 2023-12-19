import { Server } from 'http';

import { createApp } from './app';
import { configService, loggerService } from './container';
import { db } from './database';

export const unhandledRejectionHandler = (
  reason: unknown,
  promise: unknown
) => {
  loggerService.error('Unhandled Rejection at Promise', { reason, promise });
};

export const uncaughtExceptionHandler = (error: unknown) => {
  loggerService.error('Uncaught Exception', error);
  process.exit(1);
};

export const gracefulShutdown = (server: Server) => {
  return () => {
    loggerService.info('Starting graceful shutdown process');
    db.close();
    server.close();
    loggerService.info('Shutting down now');
    process.exit(0);
  };
};

export async function main() {
  const PORT = configService.get('PORT');
  const app = createApp();

  process.on('unhandledRejection', unhandledRejectionHandler);
  process.on('uncaughtException', uncaughtExceptionHandler);

  const server = app.listen(PORT, () =>
    loggerService.info(`Server started at port ${PORT}`)
  );

  process.on('SIGTERM', gracefulShutdown(server));
  process.on('SIGINT', gracefulShutdown(server));
}

main();
