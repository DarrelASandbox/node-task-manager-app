import app from '../src/app';
import request from 'supertest';
import Task from '../src/models/tasks.mjs';
import { user1, user1Id, setupDatabase } from './fixtures/db';
// In package.json input "runInBand"
// https://jestjs.io/docs/cli#--runinband

// https://jestjs.io/docs/setup-teardown
beforeEach(setupDatabase);

test('Should create task for user.', async () => {
  try {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .send({ description: 'Ride an ant' })
      .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
  } catch (e) {
    expect(e).toMatch('error');
  }
});
