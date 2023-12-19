import { HttpException } from './http-exception';

export class Conflict extends HttpException {
  constructor(public readonly cause: unknown) {
    super(409, 'Conflict', cause);
  }
}
