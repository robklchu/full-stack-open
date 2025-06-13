require("dotenv").config();
const express = require("express");
const Blog = require("./models/blog");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
