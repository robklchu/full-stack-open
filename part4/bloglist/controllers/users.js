const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response) => {
  const allUsers = await User.find({});
  response.json(allUsers);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  const saltRounds = 10;

  const user = new User({
    username,
    name,
    passwordHash: await bcrypt.hash(password, saltRounds),
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = userRouter;
