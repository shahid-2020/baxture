import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { LoggerService } from '../../common/logger';
import { parseZodError } from '../../common/utils';
import {
  BadRequest,
  HttpException,
  InternalServerError,
  NotFound,
} from '../../http/exception';

export class ErrorMiddleware {
  constructor(private readonly loggerService: LoggerService) {
    this.routeNotFound = this.routeNotFound.bind(this);
    this.processError = this.processError.bind(this);
  }

  private sendResponse(req: Request, res: Response, exception: HttpException) {
    return res.status(exception.statusCode).send({
      statusCode: exception.statusCode,
      message: exception.message,
      cause: exception.cause,
      uri: `${req.protocol}://${req.hostname}${req.originalUrl}`,
      date: new Date().toISOString(),
    });
  }

  routeNotFound(_req: Request, _res: Response, next: NextFunction) {
    const exception = new NotFound('Route not found');
    return next(exception);
  }

  processError(error: Error, req: Request, res: Response, _next: NextFunction) {
    const uri = `${req.protocol}://${req.hostname}${req.originalUrl}`;

    this.loggerService.error('Error encountered', { uri, error });

    if (error instanceof HttpException) {
      return this.sendResponse(req, res, error);
    }

    if (error instanceof ZodError) {
      return this.sendResponse(req, res, new BadRequest(parseZodError(error)));
    }

    return this.sendResponse(
      req,
      res,
      new InternalServerError('Unexpected error occurred')
    );
  }
}
