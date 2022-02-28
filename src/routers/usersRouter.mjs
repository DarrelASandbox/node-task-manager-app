import express from 'express';
import auth from '../middleware/auth.mjs';
import User from '../models/users.mjs';

const usersRouter = new express.Router();

// https://httpstatuses.com/
usersRouter.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

usersRouter.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

usersRouter.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

usersRouter.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

usersRouter.get('/users/me', auth, async (req, res) => res.send(req.user));

usersRouter.patch('/users/me', auth, async (req, res) => {
  const updateFields = Object.keys(req.body);
  // Feature improvement: Dynamically fetching fields from the Mongoose model
  const allowedUpdateFields = ['name', 'age', 'email', 'password'];
  const isValidUpdateField = updateFields.every((updateField) =>
    allowedUpdateFields.includes(updateField)
  );
  if (!isValidUpdateField) return res.status(400).send('Invalid update field.');

  try {
    updateFields.forEach(
      (updateField) => (req.user[updateField] = req.body[updateField])
    );
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

usersRouter.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

export default usersRouter;
