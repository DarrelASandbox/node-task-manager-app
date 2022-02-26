import express from 'express';
import './db/mongoose.mjs';
import User from './models/users.mjs';
import Task from './models/tasks.mjs';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// https://httpstatuses.com/
app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// The findById method will throw an error if the id you pass it is improperly formatted so you should see a 500 error most of the time.
// However, if you pass in an id that is validly formatted, but does not exist in the database then you will get the 404 sent back.
app.get('/users/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).send('Invalid id.');

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('No user found.');
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/tasks/', async (req, res) => {
  try {
    const task = await Task.find();
    if (task.length === 0) return res.status(404).send('No task found.');
    res.send(task);
  } catch (e) {
    res.status(500).send(error);
  }
});

app.get('/tasks/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).send('Invalid id.');

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('No task found.');
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(port, () => console.log(`Server on port ${port}`));
