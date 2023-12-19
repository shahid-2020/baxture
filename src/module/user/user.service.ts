import { randomUUID } from 'crypto';
import { Database } from 'sqlite3';

import {
  CreateUserCommand,
  UpdateUserCommand,
  User,
  UserDbResult,
} from './user.schema';

export class UserService {
  constructor(private readonly db: Database) {}

  async find(): Promise<User[] | []> {
    const findQuery = `SELECT * FROM users`;
    const users: User[] = await new Promise((resolve, reject) => {
      this.db.all(
        findQuery,
        function (err: Error | null, rows: UserDbResult[]) {
          if (err) {
            reject(err);
          } else {
            resolve(
              rows.map((row) => ({
                ...row,
                hobbies: JSON.parse(row.hobbies),
              }))
            );
          }
        }
      );
    });
    return users;
  }

  async findOne(id: string): Promise<User> {
    const findOneQuery = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(
        findOneQuery,
        [id],
        function (err: Error | null, row: UserDbResult) {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(row);
          } else {
            resolve({ ...row, hobbies: JSON.parse(row.hobbies) });
          }
        }
      );
    });
  }

  async create(command: CreateUserCommand): Promise<User> {
    const { username, age, hobbies } = command;
    const id = randomUUID();
    const values = [id, username, age, JSON.stringify(hobbies)];
    const createQuery = `INSERT INTO users (id, username, age, hobbies) VALUES (?, ?, ?, ?);`;
    await new Promise((resolve, reject) => {
      this.db.run(createQuery, values, function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
    const user = await this.findOne(id);
    return user;
  }

  async update(id: string, command: UpdateUserCommand): Promise<User | null> {
    const { username, age, hobbies } = command;
    const updateQuery = `UPDATE users SET username = ?, age = ?, hobbies = ? WHERE id = ?`;
    const values = [username, age, JSON.stringify(hobbies), id];

    await new Promise((resolve, reject) => {
      this.db.run(updateQuery, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });

    const updatedUser = await this.findOne(id);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const deleteQuery = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(deleteQuery, [id], function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
