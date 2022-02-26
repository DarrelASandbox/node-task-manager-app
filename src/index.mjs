import express from 'express';
import './db/mongoose.mjs';
import tasksRouter from './routers/tasksRouter.mjs';
import usersRouter from './routers/usersRouter.mjs';
import bcrypt from 'bcrypt';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);
app.listen(port, () => console.log(`Server on port ${port}`));

// const myFunc = async () => {
//   const password = 'Hunter234562576987Hunter';
//   const hashedPassword = await bcrypt.hash(password, 10);
//   console.log(password);
//   console.log(hashedPassword);

//   const isMatch = await bcrypt.compare(password, hashedPassword);
//   console.log(isMatch);
// };
// myFunc();
