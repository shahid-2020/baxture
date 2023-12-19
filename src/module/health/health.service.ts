import { Request } from 'express';

export class HealthService {
  async health(req: Request): Promise<unknown> {
    return {
      status: 'active',
      uri: `${req.protocol}://${req.hostname}${req.originalUrl}`,
      date: new Date().toISOString(),
    };
  }
}
