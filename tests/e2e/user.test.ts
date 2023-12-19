import { randomUUID } from 'crypto';
import request from 'supertest';

import { createApp } from '../../src/app';

describe('User e2e Tests', () => {
  const app = createApp();
  const user = { username: 'JohnDoe', age: 30, hobbies: ['coding'] };

  describe('find', () => {
    it('should return an empty array, if table is empty', async () => {
      const response = await request(app).get('/api/v1/users/');

      expect(response.status).toBe(200);
      expect(response.body.data.users).toEqual([]);
    });

    it('should return user', async () => {
      const {
        body: {
          data: {
            user: { id },
          },
        },
      } = await request(app).post('/api/v1/users').send(user);
      const response = await request(app).get('/api/v1/users/');
      await request(app).get(`/api/users/${id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users).toEqual([{ ...user, id }]);
    });
  });

  describe('findOne', () => {
    it('should throw error, if uuid is invalid', async () => {
      const response = await request(app).get('/api/v1/users/123');

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Bad Request');
      expect(response.body.cause).toEqual('Invalid uuid');
    });

    it('should throw error, if user does not exist', async () => {
      const id = randomUUID();
      const response = await request(app).get(`/api/v1/users/${id}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Not Found');
      expect(response.body.cause).toEqual(`User does not exist: ${id}`);
    });

    it('should return user', async () => {
      const {
        body: {
          data: {
            user: { id },
          },
        },
      } = await request(app).post('/api/v1/users').send(user);
      const response = await request(app).get(`/api/v1/users/${id}`);
      await request(app).get(`/api/users/${id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.user).toEqual({ ...user, id });
    });
  });

  describe('create', () => {
    it('should throw error, if schema is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ ...user, hobbies: undefined });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Bad Request');
      expect(response.body.cause).toEqual([
        { message: 'Required', path: 'hobbies' },
      ]);
    });

    it('should return user', async () => {
      const response = await request(app).post('/api/v1/users').send(user);
      await request(app).get(`/api/users/${response.body.data.user.id}`);

      expect(response.status).toBe(201);
      expect(response.body.data.user).toEqual({
        ...user,
        id: response.body.data.user.id,
      });
    });
  });

  describe('update', () => {
    it('should throw error, if uuid is invalid', async () => {
      const response = await request(app).put('/api/v1/users/123').send(user);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Bad Request');
      expect(response.body.cause).toEqual('Invalid uuid');
    });

    it('should throw error, if user does not exist', async () => {
      const id = randomUUID();
      const response = await request(app).put(`/api/v1/users/${id}`).send(user);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Not Found');
      expect(response.body.cause).toEqual(`User does not exist: ${id}`);
    });

    it('should update and return user', async () => {
      const {
        body: {
          data: { user: createdUser },
        },
      } = await request(app).post('/api/v1/users').send(user);
      const response = await request(app)
        .put(`/api/v1/users/${createdUser.id}`)
        .send({ ...createdUser, username: 'John' });
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.user).toEqual({
        ...user,
        id: createdUser.id,
        username: 'John',
      });
    });
  });

  describe('delete', () => {
    it('should throw error, if uuid is invalid', async () => {
      const response = await request(app).delete('/api/v1/users/123');

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Bad Request');
      expect(response.body.cause).toEqual('Invalid uuid');
    });

    it('should throw error, if user does not exist', async () => {
      const id = randomUUID();
      const response = await request(app).delete(`/api/v1/users/${id}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Not Found');
      expect(response.body.cause).toEqual(`User does not exist: ${id}`);
    });

    it('should delete user', async () => {
      const {
        body: {
          data: {
            user: { id },
          },
        },
      } = await request(app).post('/api/v1/users').send(user);
      const response = await request(app).delete(`/api/v1/users/${id}`);

      expect(response.status).toBe(204);
    });
  });
});
