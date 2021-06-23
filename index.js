require("dotenv").config();

const startServer = require("./server");
const { reportTask } = require("./tasks");

startServer(async () => {
  try {
    reportTask().start();

    // TODO: delete image task
  } catch (error) {
    console.error(error);
  }
});
