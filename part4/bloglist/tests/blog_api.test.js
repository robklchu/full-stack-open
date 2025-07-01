const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const app = require("../app");
const supertest = require("supertest");
const { initialBlogs, blogsInDb } = require("./test_helper");

const api = supertest(app);

describe("BlogList API", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

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
      .send(newBlogPost)
      .expect(201)
      .expect("Content-Type", /json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test("returns status 400 if title property is missing from a request", async () => {
    const newBlogPost = {
      author: "Romano Lovebird",
      url: "http://romano.lovebird.com/how-to-be-happy",
      likes: 33,
    };

    await api.post("/api/blogs").send(newBlogPost).expect(400);
  });

  test("returns status 400 if url property is missing from a request", async () => {
    const newBlogPost = {
      title: "How to be happy",
      author: "Romano Lovebird",
      likes: 33,
    };

    await api.post("/api/blogs").send(newBlogPost).expect(400);
  });

  describe.only("deleting a blog post", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

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
        .expect(404);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.strictEqual(response.body.message, "Blog not found");
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
