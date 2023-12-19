import { z } from 'zod';

export const user = z.object({
  id: z.string(),
  username: z.string(),
  age: z.number(),
  hobbies: z.array(z.string()).nullable(),
});

export type User = z.TypeOf<typeof user>;

export const userDbResult = z.object({
  id: z.string(),
  username: z.string(),
  age: z.number(),
  hobbies: z.string(),
});

export type UserDbResult = z.TypeOf<typeof userDbResult>;

export const createUserCommand = z.object({
  username: z.string(),
  age: z.number(),
  hobbies: z.array(z.string()).nullable(),
});

export type CreateUserCommand = z.TypeOf<typeof createUserCommand>;

export const updateUserCommand = z.object({
  username: z.string(),
  age: z.number(),
  hobbies: z.array(z.string()).nullable(),
});

export type UpdateUserCommand = z.TypeOf<typeof updateUserCommand>;
