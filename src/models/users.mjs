import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
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
});

// statics are the methods defined on the Model. methods are defined on the document (instance).
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this.id.toString() }, 'Hunter2');
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
const User = mongoose.model('User', userSchema);

export default User;
