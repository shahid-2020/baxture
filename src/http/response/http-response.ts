export abstract class HttpResponse {
  constructor(
    public readonly data: unknown,
    public readonly statusCode: number,
    public readonly status?: string
  ) {}
}
