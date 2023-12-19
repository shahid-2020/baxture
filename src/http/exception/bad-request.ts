import { HttpException } from './http-exception';

export class BadRequest extends HttpException {
  constructor(public readonly cause: unknown) {
    super(400, 'Bad Request', cause);
  }
}
