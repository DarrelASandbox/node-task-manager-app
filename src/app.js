import express from 'express';
import './db/mongoose.mjs';
import tasksRouter from './routers/tasksRouter.mjs';
import usersRouter from './routers/usersRouter.mjs';

const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

export default app;
