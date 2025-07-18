const app = require("./app");
const logger = require("./utils/logger");
const config = require("./utils/config");

const PORT = config.PORT;

// start web server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
