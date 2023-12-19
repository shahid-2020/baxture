import { HttpResponse } from './http-response';

export class Ok extends HttpResponse {
  constructor(data: unknown = null) {
    super(data, 200, 'Success');
  }
}
