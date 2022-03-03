import app from '../src/app';
import request from 'supertest';
import Task from '../src/models/tasks.mjs';
import { user1, user1Id, setupDatabase, task1, user2 } from './fixtures/db';
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

test('Should get tasks of a user.', async () => {
  try {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${user1.tokens[0].token}`)
      .expect(200);

    expect(response.body.length).toBe(4);
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should not be able to delete task of user1 via user2 account.', async () => {
  try {
    console.log(task1._id);
    console.log(task1._id.toString());
    const response = await request(app)
      .delete(`/tasks/${task1._id.toString()}`)
      .set('Authorization', `Bearer ${user2.tokens[0].token}`)
      .send()
      .expect(404);

    const task = Task.findById(task1._id);
    expect(task).not.toBeNull();
  } catch (e) {
    expect(e).toMatch('error');
  }
});

// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks
