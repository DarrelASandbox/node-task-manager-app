import express from 'express';
import './db/mongoose.mjs';
import tasksRouter from './routers/tasksRouter.mjs';
import usersRouter from './routers/usersRouter.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);
app.listen(port, () => console.log(`Server on port ${port}`));

// import jwt from 'jsonwebtoken';

// const myFunc = async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'thisishunter2', {
//     expiresIn: '5 seconds',
//   });
//   console.log(token);

//   console.log(jwt.verify(token, 'thisishunter2'));
// };

// myFunc();
