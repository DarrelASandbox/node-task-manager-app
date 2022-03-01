import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.mjs';
import User from '../models/users.mjs';

// With callbacks, you typically want to pass the error as an argument instead of throwing an error.
// That lets you respond to the error by adding code inside the callback.
// If you throw an error, you'll see that the callback doesn't run as the callback is never called.
// Instead, you'd need to add a try/catch statement to catch the error and respond to the error.
const usersRouter = new express.Router();
const upload = multer({
  limits: { fileSize: 1_000_000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(
        new Error('Please upload file only with jpg, jpeg or png format.')
      );

    cb(undefined, true);
  },
});

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

// Do not store the image in the file system because the file system gets wipe when deploying to hosting service.
// In this tutorial, we will store the image binary data by adding additional field in user model.
// However, ideally storing the image path would be preferred. Using services like Amazon S3 or Google Storage bucket.
// When your user uploads the image, you send the image itself to the bucket, retrieve the URL, and save the image URL in your blog document instead.
usersRouter.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    if (!req.file) return res.send('Please attach a picture.');
    // <img src='data:image/jpg;base64, <binary> >
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send('Successfully uploaded.');
  },
  (e, req, res, next) => {
    res.status(400).send({ error: e.message });
  }
);

usersRouter.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

export default usersRouter;
