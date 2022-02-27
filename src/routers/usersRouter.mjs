import express from 'express';
import mongoose from 'mongoose';
import User from '../models/users.mjs';
import auth from '../middleware/auth.mjs';

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

usersRouter.get('/users/me', auth, async (req, res) => {
  res.send(req.user);

  // try {
  //   const users = await User.find();
  //   if (users.length === 0) return res.status(404).send('No user found.');
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send();
  // }
});

// The findById method will throw an error if the id you pass it is improperly formatted so you should see a 500 error most of the time.
// However, if you pass in an id that is validly formatted, but does not exist in the database then you will get the 404 sent back.
usersRouter.get('/users/:id', async (req, res) => {
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

usersRouter.patch('/users/:id', async (req, res) => {
  const updateFields = Object.keys(req.body);
  // Feature improvement: Dynamically fetching fields from the Mongoose model
  const allowedUpdateFields = ['name', 'age', 'email', 'password'];
  const isValidUpdateField = updateFields.every((updateField) =>
    allowedUpdateFields.includes(updateField)
  );

  if (!isValidUpdateField) return res.status(400).send('Invalid update field.');

  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).send('Invalid id.');

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('No user found.');
    updateFields.forEach(
      (updateField) => (user[updateField] = req.body[updateField])
    );
    await user.save();

    // Replace the code below with the code above to enable middleware.
    // findByIdAndUpdate() bypasses mongoose which perform a direct operation on the database.

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // https://mongoosejs.com/docs/validation.html#update-validators

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

usersRouter.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('No user found.');
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

export default usersRouter;
