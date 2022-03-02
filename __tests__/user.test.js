import request from 'supertest';
import app from '../src/app';

test('Should signup a new user', async () => {
  try {
    await request(app)
      .post('/users')
      .send({
        name: 'mongkong',
        age: 8,
        email: 'mongkong@mongmail.com',
        password: 'passw0rd',
      })
      .expect(201);
  } catch (e) {
    expect(e).toMatch('error');
  }
});
