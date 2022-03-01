import express from 'express';
import './db/mongoose.mjs';
import tasksRouter from './routers/tasksRouter.mjs';
import usersRouter from './routers/usersRouter.mjs';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);
app.listen(port, () => console.log(`Server on port ${port}`));
