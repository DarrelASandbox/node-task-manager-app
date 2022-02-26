import express from 'express';
import './db/mongoose.mjs';
import User from './models/users.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.send(user))
    .catch((error) => console.log(error));
});

app.listen(port, () => console.log(`Server on port ${port}`));
