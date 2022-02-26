import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/tasks.mjs';

const tasksRouter = new express.Router();

tasksRouter.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

tasksRouter.get('/tasks/', async (req, res) => {
  try {
    const task = await Task.find();
    if (task.length === 0) return res.status(404).send('No task found.');
    res.send(task);
  } catch (e) {
    res.status(500).send(error);
  }
});

tasksRouter.get('/tasks/:id', async (req, res) => {
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

tasksRouter.patch('/tasks/:id', async (req, res) => {
  const updateFields = Object.keys(req.body);
  // Feature improvement: Dynamically fetching fields from the Mongoose model
  const allowedUpdateFields = ['description', 'completed'];
  const isValidUpdate = updateFields.every((update) =>
    allowedUpdateFields.includes(update)
  );

  if (!isValidUpdate) return res.status(400).send('Invalid update field.');

  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).send('Invalid id.');

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).send('No task found.');
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

tasksRouter.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  try {
    if (!task) return res.status(404).send('No task found.');
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

export default tasksRouter;
