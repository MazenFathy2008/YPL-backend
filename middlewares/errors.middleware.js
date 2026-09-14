const errorsMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || "SERVER_ERROR";

  if (err.name === "CastError") {
    statusCode = 404;
    errorCode = "DATA_NOT_FOUND";
  }

  if (err.code === 11000) {
    statusCode = 409;
    errorCode = "DATA_ALREADY_EXISTS";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
  }

  if (err.name === "FileTypeError") {
    statusCode = err.statusCode || 400;
    errorCode = "INVALID_FILE_TYPE";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorCode = "INVALID_TOKEN";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorCode = "TOKEN_EXPIRED";
  }

  res.status(statusCode).json({
    success: false,
    error: errorCode,
  });
};

export default errorsMiddleware;
