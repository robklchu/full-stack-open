const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const supertest = require("supertest");
const { initialBlogs, blogsInDb } = require("./test_helper");

const api = supertest(app);

describe("BlogList API", async () => {
  await User.deleteMany({});

  const creator = {
    username: "robertchu",
    name: "Robert Chu",
    password: "hehehaha",
  };

  await api.post("/api/users").send(creator);
  const response = await api.post("/api/login").send(creator);
  const token = response.body.token;

  beforeEach(async () => {
    await Blog.deleteMany({});

    const users = await User.find({});
    for (let user of users) {
      user.blogs = [];
      await user.save();
    }

    await Blog.insertMany(initialBlogs);
    const blogs = await Blog.find({});
    for (let blog of blogs) {
      await api.get(`/api/blogs/${blog._id.toString()}`);
    }
  });

  describe("retrieving blog posts", () => {
    test("GET request returns blog posts in JSON format", async () => {
      await api.get("/api/blogs").expect(200).expect("Content-Type", /json/);
    });

    test("GET request returns correct amount of blog posts", async () => {
      const response = await api.get("/api/blogs");

      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("unique identifier property of blog posts is named 'id'", async () => {
      const testId = initialBlogs[0]._id;

      const dbDoc = await Blog.findById(testId);
      const dbDocId = dbDoc._id.toString();

      const response = await api.get("/api/blogs");
      const blog = response.body.find((b) => b.id === testId);

      assert.strictEqual(blog.id, dbDocId);
    });
  });

  describe("adding a blog post", () => {
    test("POST request creates a new blog post", async () => {
      const newBlogPost = {
        title: "How to be happy",
        author: "Romano Lovebird",
        url: "http://romano.lovebird.com/how-to-be-happy",
        likes: 33,
      };

      const blogsAtStart = await blogsInDb();

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlogPost)
        .expect(201)
        .expect("Content-Type", /json/);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const blogsTitleAtEnd = blogsAtEnd.map((b) => b.title);
      assert(blogsTitleAtEnd.includes("How to be happy"));
    });

    test("likes property default to 0 if missing from a request", async () => {
      const newBlogPost = {
        title: "How to be happy",
        author: "Romano Lovebird",
        url: "http://romano.lovebird.com/how-to-be-happy",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlogPost)
        .expect(201)
        .expect("Content-Type", /json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("fails with status 400 if title property is missing", async () => {
      const newBlogPost = {
        author: "Romano Lovebird",
        url: "http://romano.lovebird.com/how-to-be-happy",
        likes: 33,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlogPost)
        .expect(400);
    });

    test("fails with status 400 if url property is missing", async () => {
      const newBlogPost = {
        title: "How to be happy",
        author: "Romano Lovebird",
        likes: 33,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlogPost)
        .expect(400);
    });

    test("fails with status 401 if token is not provided", async () => {
      const newBlogPost = {
        title: "How to be happy",
        author: "Romano Lovebird",
        url: "http://romano.lovebird.com/how-to-be-happy",
        likes: 33,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer `)
        .send(newBlogPost)
        .expect(401)
        .expect("Content-Type", /json/);
    });
  });

  describe("deleting a blog post", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test("fails with status code 404 if id is invalid", async () => {
      const blogsAtStart = await blogsInDb();
      const invalidBlogId = "5a422bc61b54a676234d17ff";
      const response = await api
        .delete(`/api/blogs/${invalidBlogId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.strictEqual(response.body.error, "blog not found");
    });
  });

  describe("updating a blog post", () => {
    test("succeeds in updating the number of likes", async () => {
      const blogsAtStart = await blogsInDb();
      const updatedBlog = {
        ...blogsAtStart[0],
        likes: blogsAtStart[0].likes + 1,
      };

      await api.put(`/api/blogs/${blogsAtStart[0].id}`).send(updatedBlog);

      const response = await api.get("/api/blogs");
      const blog = response.body.find((b) => b.id === updatedBlog.id);

      assert.strictEqual(blog.likes, blogsAtStart[0].likes + 1);
    });

    test("fails with status code 404 if id is invalid", async () => {
      const blogsAtStart = await blogsInDb();
      const invalidBlogId = "5a422bc61b54a676234d17ff";
      const invalidBlog = {
        ...blogsAtStart[0],
        likes: blogsAtStart[0].likes + 1,
        id: invalidBlogId,
      };

      await api
        .put(`/api/blogs/${invalidBlog.id}`)
        .send(invalidBlog)
        .expect(404);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
