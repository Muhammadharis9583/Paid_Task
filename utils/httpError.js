class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true; // for operational errors that can be predicted like invalid fields or unable to save document in the db

    Error.captureStackTrace(this, this.constructor);
    // create a stack trace that will not be a part of class object.
  }
}

module.exports = HttpError;
