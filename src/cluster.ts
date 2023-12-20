import cluster, { Worker } from 'cluster';
import os from 'os';

import { loggerService } from './container';
import { server } from './server';

if (cluster.isPrimary) {
  const cores = os.cpus().length;

  loggerService.info(`Total cores: ${cores}`);
  loggerService.info(`Primary process ${process.pid} is running`);

  for (let i = 0; i < cores; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: Worker, code) => {
    loggerService.info(`Worker ${worker.process.pid} exited with code ${code}`);
    loggerService.info('Fork new worker!');
    cluster.fork();
  });
} else {
  server();
}
