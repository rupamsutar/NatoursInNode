const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARES
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the Middleware :)');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// HOME ROUTES
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side !', app: 'Natours' });
});

app.post('/', (req, res) => {
  res
    .status(404)
    .json({
      message: 'You can send post req to this server !',
      app: 'Natours',
    });
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', function(req, res, next) {
  res.status(404).json({
    status: 'failed',
    message: `Can't find ${req.originalUrl} on this server !`
  })
})

module.exports = app;
