const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response) => {
  const allUsers = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(allUsers);
});

userRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  const saltRounds = 10;

  if (!password) {
    return response.status(400).json({ error: "password is required" });
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 character long" });
  }

  const user = new User({
    username,
    name,
    passwordHash: await bcrypt.hash(password, saltRounds),
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = userRouter;
