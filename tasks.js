const cron = require("node-cron");

const report = require("./report");
const { ID_P, ID_M, taskSchedule } = require("./configs");

const reportTask = () => {
  console.log("--------------------------------------------------");
  console.log("------------- REPORTS TAKS SCHEDULED -------------");
  console.log("--------------------------------------------------");

  return cron.schedule(
    taskSchedule,
    async () => {
      try {
        await report(ID_P);
        await report(ID_M);
      } catch (error) {
        console.log("ERROR REPORTING!");
        console.error(error);
      }
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
