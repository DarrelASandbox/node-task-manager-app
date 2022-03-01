import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import Task from './tasks.mjs';
import sharp from 'sharp';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) throw new Error('Age must be a positive number.');
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validator(value) {
        if (!validator.isEmail(value)) throw new Error('Invalid email');
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password'))
          throw new Error('Password must not contain the word "password".');
      },
    },
    // array of objects
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    // https://mongoosejs.com/docs/schematypes.html#buffers
    // https://nodejs.org/api/buffer.html#buffer
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

// It’s a virtual property because users in the database won’t have a tasks field.
// It’s a reference to the task data stored in the separate collection.
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// toJSON() behavior: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
// The toObject method is a method provided by Mongoose to clean up the object so it removes all of the metadata and methods
// (like .save() or .toObject()) that Mongoose attaches to it. It just becomes a regular object afterward.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

// statics are the methods defined on the Model. methods are defined on the document (instance).
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this.id.toString() }, process.env.JWT_SECRET);
  this.tokens = [...this.tokens, { token }];
  await this.save();
  return token;
};

// Add static function model to check credentials.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to login.');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login.');
  return user;
};

// encryption -> able to reverse back to original password.
// hashing -> unable to reverse back to original password. One-way algorithm.
userSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 10);

  next();
});

// Mongoose has more than one middleware that uses deleteOne().
// To ensure that this is referencing a user document in the pre hook middleware we need to set the options object with a document: true property.
userSchema.pre('deleteOne', { document: true }, async function (next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
