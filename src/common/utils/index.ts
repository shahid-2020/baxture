import { ZodError } from 'zod';

export const isValidUUID = (uuid: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export function parseZodError(error: ZodError) {
  return error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));
}
