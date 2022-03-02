import app from './app.js';

const port = process.env.PORT;
app.listen(port, () => console.log(`Server on port ${port}`));

// Refactor code into 2 files (app.js & index.mjs)
// so that we can get the express app without calling the app.listen(...).
// The primary reason is that we don't want our test suite to be dependant on Express to work.
// We can switch out whichever HTTP server we want this way in the future if we need to without breaking our tests.
