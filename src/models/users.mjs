import mongoose from 'mongoose';
import validator from 'validator';

const User = mongoose.model('User', {
  name: { type: String, required: true, trim: true },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) throw new Error('Age must be a positive number.');
    },
  },
  email: {
    type: String,
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
});

// const user = new User({
//   name: 'mongfoo2',
//   age: 1,
//   email: 'mongfoo2@mongmail.com',
//   password: 'p       d',
// });

// user
//   .save()
//   .then(() => console.log(user))
//   .catch((error) => console.log(error));

export default User;
