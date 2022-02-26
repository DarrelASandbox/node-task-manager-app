import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const User = mongoose.model('User', {
  name: { type: String, required: true },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) throw new Error('Age must be a positive number.');
    },
  },
});

const user1 = new User({
  name: 'mongfoo',
  age: 1,
});

// user1
//   .save()
//   .then(() => console.log(user1))
//   .catch((error) => console.log(error));

const Task = mongoose.model('Task', {
  title: { type: String },
  completed: { type: Boolean },
});

const task1 = new Task({
  title: 'Sleep for 17,318,751 hours',
  completed: false,
});

// task1
//   .save()
//   .then(() => console.log(task1))
//   .catch((error) => console.log(error));
