const express = require("express");
const blogRouter = require("./controllers/blogs");
const logger = require("./utils/logger");
const config = require("./utils/config");

const app = express();

app.use(express.json());
app.use("/api/blogs", blogRouter);

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
