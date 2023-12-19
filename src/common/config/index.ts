import dotenv from 'dotenv';
import { join, resolve } from 'path';
import { z } from 'zod';

import { parseZodError } from '../utils';

const EnvSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.string(),
});

type EnvSchemaType = z.infer<typeof EnvSchema>;

export class ConfigService {
  env: EnvSchemaType;

  constructor(filePath?: string) {
    dotenv.config({ path: filePath || join(resolve('./'), '.env') });
    this.env = this.validate(process.env);
  }

  validate(values: Record<string, unknown>): EnvSchemaType {
    const result = EnvSchema.safeParse(values);

    if (result.success) {
      return result.data;
    }
    throw new TypeError('Env validation error', {
      cause: parseZodError(result.error),
    });
  }

  get(key: keyof EnvSchemaType) {
    return this.env[key];
  }
}
