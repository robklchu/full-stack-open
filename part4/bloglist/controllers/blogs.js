const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  let body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  if (!body.likes) {
    body = { ...body, likes: 0 };
  }

  const blog = new Blog(body);
  const result = await blog.save();
  return response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
  if (!deletedBlog) {
    response.status(404).json({ message: "Blog not found" });
  } else {
    response.status(204).end();
  }
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blogToUpdate = await Blog.findById(request.params.id);

  if (!blogToUpdate) {
    return response.status(404).end();
  }

  blogToUpdate.title = body.title;
  blogToUpdate.author = body.author;
  blogToUpdate.url = body.url;
  blogToUpdate.likes = body.likes;

  const updatedBlog = await blogToUpdate.save();

  return response.json(updatedBlog);
});

module.exports = blogRouter;
