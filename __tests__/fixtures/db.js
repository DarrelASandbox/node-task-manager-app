import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../src/models/users.mjs';

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1Id,
  name: 'mongchick',
  age: 7,
  email: 'darrelaiscoding@gmail.com',
  password: 'passw0rd',
  tokens: [
    {
      token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET),
    },
  ],
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(user1).save();
};

export { setupDatabase, user1, user1Id };
