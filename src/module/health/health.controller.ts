import { NextFunction, Request, Response, Router } from 'express';

import { HttpResponse, Ok } from '../../http/response';
import { HealthService } from './health.service';

export class HealthController {
  private router: Router;

  constructor(private readonly healtService: HealthService) {
    this.router = Router();
    this.health = this.health.bind(this);
  }

  async health(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<HttpResponse | unknown> {
    try {
      const health = await this.healtService.health(req);
      const ok = new Ok(health);
      return res.status(ok.statusCode).send(ok);
    } catch (error: unknown) {
      return next(error);
    }
  }

  public routes(): Router {
    this.router.get('/', this.health);
    return this.router;
  }
}
