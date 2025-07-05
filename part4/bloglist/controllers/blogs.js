const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "Invalid blog ID" });
  }

  if (!blog.user) {
    const allUsers = await User.find({});
    const user = allUsers[Math.floor(Math.random() * allUsers.length)];

    blog.user = user._id;
    await blog.save();

    user.blogs = user.blogs.concat(blog._id);
    await user.save();
  }
  return response.json(
    await blog.populate("user", {
      username: 1,
      name: 1,
    })
  );
});

blogRouter.post("/", userExtractor, async (request, response, next) => {
  let body = request.body;

  try {
    const user = request.user;

    if (!body.title || !body.url) {
      return response.status(400).end();
    }

    if (!body.likes) {
      body = { ...body, likes: 0 };
    }

    const blog = new Blog({
      ...body,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    return response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);

      user.blogs = user.blogs.filter(
        (blogId) => blogId.toString() !== request.params.id
      );
      await user.save();

      return response.status(204).end();
    }
    return response.status(401).json({ error: "unauthorized user" });
  } catch (exception) {
    next(exception);
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
