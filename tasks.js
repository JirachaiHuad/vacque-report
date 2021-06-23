const cron = require("node-cron");

const report = require("./report");
const { ID_P, ID_M } = require("./configs");

const reportTask = () => {
  console.log("--------------------------------------------------");
  console.log("------------- REPORTS TAKS SCHEDULED -------------");
  console.log("--------------------------------------------------");

  return cron.schedule(
    "0 0 * * *",
    async () => {
      await report(ID_P);
      await report(ID_M);
    },
    {
      scheduled: false,
      timezone: "Asia/Bangkok",
    }
  );
};

module.exports = {
  reportTask,
};
