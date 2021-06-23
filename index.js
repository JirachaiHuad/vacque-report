require("dotenv").config();

const startServer = require("./server");
const { reportTask } = require("./tasks");

startServer(() => {
  reportTask().start();

  // TODO: delete image task
});
