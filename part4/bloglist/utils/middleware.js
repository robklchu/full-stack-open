const logger = require("./logger");

function errorHandler(error, request, response, next) {
  // logger.error(error.name);
  // logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  }
  next(error);
}

module.exports = { errorHandler };
