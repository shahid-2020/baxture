import { Database } from 'sqlite3';

export const db = new Database(':memory:');

db.run(
  'CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT NOT NULL, age INTEGER NOT NULL, hobbies TEXT[] NOT NULL);'
);
