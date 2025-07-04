const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

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

blogRouter.post("/", async (request, response) => {
  let body = request.body;

  // const user = await User.findById(body.userId);
  // if (!user) {
  //   return response.status(400).json({ error: "userId missing or invalid" });
  // }

  const allUsers = await User.find({});
  const user = allUsers[Math.floor(Math.random() * allUsers.length)];

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
