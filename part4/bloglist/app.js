const mongoose = require("mongoose");
const express = require("express");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const config = require("./utils/config");
const logger = require("./utils/logger");

// connect to database
const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(logger.info("connected to MongoDB"))
  .catch((err) => logger.error("error connection to MongoDB:", err.message));

// connect to middleware
const app = express();
app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

module.exports = app;
