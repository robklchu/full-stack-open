const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const app = require("../app");
const supertest = require("supertest");
const { initialBlogs } = require("./api_test_data");

const api = supertest(app);

describe("BlogList API", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test("GET request returns blog posts in JSON format", async () => {
    await api.get("/api/blogs").expect(200).expect("Content-Type", /json/);
  });

  test("GET request returns correct amount of blog posts", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("unique identifier property of blog posts is named 'id'", async () => {
    await Blog.deleteMany({});

    const blog = new Blog(initialBlogs[0]);
    await blog.save();

    const dbDoc = await Blog.find({});
    const dbDocId = dbDoc[0]._id.toString();

    const response = await api.get("/api/blogs");
    const blogId = response.body[0].id;

    assert.strictEqual(blogId, dbDocId);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
