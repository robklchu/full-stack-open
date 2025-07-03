const mongoose = require("mongoose");
const supertest = require("supertest");

const assert = require("node:assert");
const { describe, test, beforeEach, after } = require("node:test");

const User = require("../models/user");
const helper = require("./test_helper");

const app = require("../app");
const api = supertest(app);

describe("adding new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("succeeds if both username and password are given", async () => {
    const newUser = {
      username: "hellas",
      password: "sekret",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 1);
  });

  test("fails if username is missing", async () => {
    const newUser = {
      name: "Robert Chu",
      password: "hehehaha",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /json/);

    assert(response.body.error.includes("Path `username` is required"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 0);
  });

  test("fails if username is less than 3 characters long", async () => {
    const newUser = {
      username: "rc",
      name: "Robert Chu",
      password: "hehehaha",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /json/);

    assert(
      response.body.error.includes(
        "shorter than the minimum allowed length (3)"
      )
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 0);
  });

  test("fails if password is missing", async () => {
    const newUser = {
      username: "robertchu",
      name: "Robert Chu",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /json/);

    assert(response.body.error.includes("password is required"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 0);
  });

  test("fails if password is less than 3 characters long", async () => {
    const newUser = {
      username: "robertchu",
      name: "Robert Chu",
      password: "p",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /json/);

    assert(
      response.body.error.includes("password must be at least 3 character long")
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 0);
  });

  test("fails if username duplicates", async () => {
    const newUser = {
      username: "robertchu",
      name: "Robert Chu",
      password: "hehehaha",
    };

    await api.post("/api/users").send(newUser);

    const usersFirstRun = await helper.usersInDb();
    assert.strictEqual(usersFirstRun.length, 1);

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /json/);

    assert(response.body.error.includes("expected `username` to be unique"));

    const usersSecondRun = await helper.usersInDb();
    assert.strictEqual(usersSecondRun.length, 1);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
