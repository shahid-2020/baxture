import { HttpResponse } from './http-response';

export class Created extends HttpResponse {
  constructor(data: unknown) {
    super(data, 201, 'Created');
  }
}
