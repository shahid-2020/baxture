export abstract class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly cause: unknown
  ) {
    super(message, { cause });
  }
}
