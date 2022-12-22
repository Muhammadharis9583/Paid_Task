const sendDevelopmentError = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/ecomm')) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERING WEBSITE
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  let errorObject = {
    name: err.name,
    message: err.message,
    code: err.code,
    ...err,
  };
  if (process.env.NODE_ENV === 'development') {
    sendDevelopmentError(err, req, res);
    //
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { name: err.name, message: err.message, ...err };
    console.log(errorObject);

    if (errorObject.name === 'CastError') {
      errorObject = handleCastErrorInDB(errorObject);
    }
    if (errorObject.code === 11000) {
      errorObject = handleDuplicateFieldsInDB(errorObject);
    }
    if (errorObject.name === 'ValidationError') {
      errorObject = handleValidationErrorInDB(errorObject);
    }
    if (errorObject.name === 'JsonWebTokenError') {
      errorObject = handeJWTError();
    }
    if (errorObject.name === 'TokenExpiredError') {
      errorObject = handleJWTExpiredError();
    }
    // sendErrorProd(errorObject, req, res);
  }
};
