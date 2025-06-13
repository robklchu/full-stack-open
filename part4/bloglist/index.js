require("dotenv").config();
const express = require("express");
const blogRouter = require("./controllers/blogs");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());
app.use("/api/blogs", blogRouter);

const PORT = 3003;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
