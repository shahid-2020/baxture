import { HttpResponse } from './http-response';

export class NoContent extends HttpResponse {
  constructor() {
    super(null, 204);
  }
}
