import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../src/models/users.mjs';
import Task from '../../src/models/tasks.mjs';

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

const user2Id = new mongoose.Types.ObjectId();
const user2 = {
  _id: user2Id,
  name: 'mongfox',
  age: 666,
  email: 'mongfox@example.com',
  password: 'passw0rd',
  tokens: [
    {
      token: jwt.sign({ _id: user2Id }, process.env.JWT_SECRET),
    },
  ],
};

const task1 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Fight a pancake.',
  completed: false,
  owner: user1Id,
};

const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Dance with a polar bear.',
  completed: false,
  owner: user1Id,
};

const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Jump into a manhole.',
  completed: true,
  owner: user1Id,
};

const task4 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Cry a river.',
  completed: true,
  owner: user1Id,
};

const task5 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Download more RAM.',
  completed: false,
  owner: user2Id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(user1).save();
  await new User(user2).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
  await new Task(task4).save();
  await new Task(task5).save();
};

export { setupDatabase, user1, user1Id, task1, user2 };
