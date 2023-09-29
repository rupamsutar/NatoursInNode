const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 500);
}

const handleDuplicatefieldsDB = err => {
  const message = `Duplicate field value : ${Object.keys(err.keyValue)[0]} i.e ${Object.values(err.keyValue)[0]} Please enter another value.`;
  return new AppError(message, 400);
}

const handleValidationErrorDB = err => {

  const errors = Object.values(err.errors).map(error => error.message);
  const message = `Invalid Input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
}

const handleJWTError = () => {
  return new AppError('Invalid Token, Please login again.', 401);
}
const handleJWTExpiredError = () => {
  return new AppError('Token Expired, Please login again.', 401);
}


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {

  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.error('ERROR 🌟💣', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !'
    })
  }

  
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err, name: err.name, message: err.message};
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicatefieldsDB(error);
    if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if(error.name === 'JsonWebTokenError') error = handleJWTError();
    if(error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}