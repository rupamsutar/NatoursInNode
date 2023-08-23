const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('Connection Successful');
  });

// const newTestTour = new Tour({
//   name: 'The Forest Hiker1',
//   rating: 4.7,
//   price: 497
// });

// newTestTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => console.log('error::::::::', err));

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});




