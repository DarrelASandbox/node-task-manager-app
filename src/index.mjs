import express from 'express';
import './db/mongoose.mjs';
import User from './models/users.mjs';
import Task from './models/tasks.mjs';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// https://httpstatuses.com/
app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.status(201).send(user))
    .catch((error) => res.status(400).send(error));
});

app.get('/users', (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => res.status(500).send())
);

// The findById method will throw an error if the id you pass it is improperly formatted so you should see a 500 error most of the time.
// However, if you pass in an id that is validly formatted, but does not exist in the database then you will get the 404 sent back.
app.get('/users/:id', (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).send('Invalid id.');

  User.findById(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send('No user found.');
      res.send(user);
    })
    .catch((error) => res.status(500).send(error));
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => res.status(201).send(task))
    .catch((error) => res.status(400).send(error));
});

app.get('/tasks/', (req, res) =>
  Task.find()
    .then((task) => {
      if (task.length === 0) return res.status(404).send('No task found.');
      res.send(task);
    })
    .catch((error) => res.status(500).send(error))
);

app.get('/tasks/:id', (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).send('Invalid id.');

  Task.findById(req.params.id)
    .then((task) => {
      if (!task) return res.status(404).send('No task found.');
      res.send(task);
    })
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => console.log(`Server on port ${port}`));
