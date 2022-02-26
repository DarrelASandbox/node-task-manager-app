import mongoose from 'mongoose';
import validator from 'validator';

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const Task = mongoose.model('Task', {
  description: { type: String, trim: true, required: true },
  completed: { type: Boolean, default: false },
});
