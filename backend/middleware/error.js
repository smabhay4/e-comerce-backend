//middleware(app.use() se banne waala) to handle error (showing custom error message to user rather than server's complex error messages)

//importing custom Error class

//errormiddleware

const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "INTERNAL SERVER ERROR";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token Is Invalid Try Again`;
    err = new ErrorHandler(message, 400);
  }

  //JWT Expire Error
  if (err.name === "tokenExpiredError") {
    const message = `Json Web Token Is Expired Try Again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
