import mongoose from 'mongoose';
import request from 'supertest';
import util from 'util';
import app from '../src/app';
import User from '../src/models/users.mjs';
import { user1, user1Id, setupDatabase } from './fixtures/db';

const sleep = util.promisify(setTimeout);

// https://jestjs.io/docs/setup-teardown
beforeEach(setupDatabase);

test('Should signup a new user.', async () => {
  try {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'mongkong',
        age: 8,
        email: 'mongkong@example.com',
        password: 'passw0rd',
      })
      .expect(201);

    // Assert that the database was changed correctly.
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
      user: { name: 'mongkong', age: 8, email: 'mongkong@example.com' },
      token: user.tokens[0].token,
    });
    expect(user.password).not.toBe('passw0rd');
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should not contain "password" in password field', async () => {
  try {
    await request(app)
      .post('/users')
      .send({
        name: user1.name,
        age: user1.age,
        email: 'mongpassword@example.com',
        password: 'password',
      })
      .expect(400);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should have unique email.', async () => {
  try {
    await request(app)
      .post('/users')
      .send({
        name: 'randomName',
        age: 999_999_999_999,
        email: user1.email,
        password: 'randomPassw0rd',
      })
      .expect(400);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should login an exisiting user.', async () => {
  try {
    const response = await request(app)
      .post('/users/login')
      .send({ email: user1.email, password: user1.password })
      .expect(200);

    // Assert that token in response matches users second token.
    const user = await User.findById(user1Id);
    await sleep(800);
    expect(response.body.token).toBe(user.tokens[1].token);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should not login non-existent user.', async () => {
  try {
    await request(app)
      .post('/users/login')
      .send({ email: 'monggong@example.com', password: user1.password })
      .expect(400);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

// Need to set authorization header (see ".set" below)
test('Should get profile for user.', async () => {
  try {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .send()
      .expect(200);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should not get profile for unauthenticated user.', async () => {
  try {
    await request(app).get('/users/me').send().expect(401);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should delete account for user.', async () => {
  try {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .send()
      .expect(200);

    // Assert null response
    const user = await User.findById(user1Id);
    expect(user).toBeNull();
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should not delete account for unauthenticated user.', async () => {
  try {
    await request(app).delete('/users/me').send().expect(401);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

// Fixtues are things that allow you to setup up an environment your tests are going to run in.
// attach() is provided by supertest.
// .toBe means === and {} !== {} so the test case will fail since it is 2 distinct objects.
// So use .toEqual
test('Should upload avatar image.', async () => {
  try {
    await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .attach('avatar', '__tests__/fixtures/profile-pic.jpg')
      .expect(200);
    const user = await User.findById(user1Id);
    expect(user.avatar).toEqual(expect.any(Buffer));
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should update valid user field.', async () => {
  try {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .send({ name: 'mongcat' })
      .expect(200);
    const user = await User.findById(user1Id);
    expect(user.name).toBe('mongcat');
  } catch (e) {
    expect(e).toBe('error');
  }
});

test('Should not update invalid user field.', async () => {
  try {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .send({ someinvalidfield: 'mongcat' })
      .expect(400);
  } catch (e) {
    expect(e).toBe('error');
  }
});

afterAll(async () => await mongoose.disconnect());

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
