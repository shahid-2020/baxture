import { HttpException } from './http-exception';

export class InternalServerError extends HttpException {
  constructor(cause: unknown = null) {
    super(500, 'Internal Server Error', cause);
  }
}
