const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log('connected to the DB');
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log('app is listeninig at the port:', PORT)
);
process.on('unhandledRejection', (err) => {
  console.log('Uncaught exception! Shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
