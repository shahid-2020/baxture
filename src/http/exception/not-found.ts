import { HttpException } from './http-exception';

export class NotFound extends HttpException {
  constructor(public readonly cause: unknown) {
    super(404, 'Not Found', cause);
  }
}
