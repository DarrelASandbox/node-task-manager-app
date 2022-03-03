import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import util from 'util';
import app from '../src/app';
import {
  deleteAccountEmail,
  sendWelcomeEmail,
} from '../src/emails/account.mjs';
import User from '../src/models/users.mjs';

jest.mock('../src/emails/account.mjs', () => ({
  __esModule: true,
  sendWelcomeEmail: jest
    .fn()
    .mockImplementation(() => 'You have called a mocked sendWelcomeEmail!'),
  deleteAccountEmail: jest
    .fn()
    .mockImplementation(() => 'You have called a mocked deleteAccountEmail!'),
}));

const sleep = util.promisify(setTimeout);

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1Id,
  name: 'mongchick',
  age: 7,
  email: 'darrelaiscoding@gmail.com',
  password: 'passw0rd',
  tokens: [
    {
      token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET),
    },
  ],
};

// https://jestjs.io/docs/setup-teardown
beforeEach(async () => {
  await User.deleteMany();
  await new User(user1).save();
});

test('Should signup a new user.', async () => {
  try {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'mongkong',
        age: 8,
        email: 'mongkong@mongmail.com',
        password: 'passw0rd',
      })
      .expect(201);

    expect(sendWelcomeEmail()).toBe(
      'You have called a mocked sendWelcomeEmail!'
    );

    // Assert that the database was changed correctly.
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
      user: { name: 'mongkong', age: 8, email: 'mongkong@mongmail.com' },
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
        email: 'mongpassword@mongmail.com',
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
      .send({ email: 'monggong@mongmail.com', password: user1.password })
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

    expect(deleteAccountEmail()).toBe(
      'You have called a mocked deleAccountEmail!'
    );

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

afterAll(async () => await mongoose.disconnect());
