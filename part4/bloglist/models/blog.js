const mongoose = require("mongoose");
const logger = require("../utils/logger");

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = process.env.MONGODB_URI;

mongoose
  .connect(mongoUrl)
  .then(logger.info("connected to MongoDB"))
  .catch((err) => logger.error("error connection to MongoDB:", err.message));

module.exports = Blog;
