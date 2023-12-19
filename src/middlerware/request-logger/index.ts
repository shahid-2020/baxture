import { NextFunction, Request, Response } from 'express';

import { LoggerService } from '../../common/logger';

export class RequestLoggerMiddleware {
  constructor(private readonly loggerService: LoggerService) {
    this.use = this.use.bind(this);
  }

  use(request: Request, response: Response, next: NextFunction) {
    const orignalResponseJson = response.json;
    response.json = (body) => {
      response.locals.body = body;
      return orignalResponseJson.call(response, body);
    };
    const startTime = process.hrtime.bigint();
    const uri = `${request.protocol}://${request.hostname}${request.originalUrl}`;
    const authHeader =
      'Authorization' in request.headers ? 'Authorization' : 'authorization';

    const { method, headers, body } = request;

    const authorization = request
      .get(authHeader)
      ?.split(' ')[1]
      .replace(/[^.]+$/, 'REDACTED');

    this.loggerService.info('API request', {
      method,
      uri,
      authorization,
      headers: { ...headers, [authHeader]: authorization },
      body: body,
    });

    response.on('finish', () => {
      const duration = `${
        Number(process.hrtime.bigint() - startTime) / 1e6
      } ms`;
      const { statusCode } = response;
      const res = {
        method,
        uri,
        statusCode,
        body: response.locals.body,
        duration,
      };
      if (statusCode >= 500) {
        return this.loggerService.error('API response', res);
      }
      return this.loggerService.info('API response', res);
    });
    return next();
  }
}
