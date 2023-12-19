import { HttpException } from './http-exception';

export class UnprocessableEntity extends HttpException {
  constructor(public readonly cause: unknown) {
    super(422, 'Unprocessable Entity', cause);
  }
}
