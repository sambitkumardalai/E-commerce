const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server erro";

  //   wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // mongoose duplciate key error
  if (err.code === 11000) {
    console.log(err);
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  // Wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid,Try again`;
    err = new ErrorHandler(message, 400);
  }
  // Jwt expire erro
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired,Tryp again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
