const express = require("express");
const path = require("path");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "screenshots")));

app.get("/check", (req, res) => res.send({ status: "ok" }));

const startServer = (callback) => {
  return app.listen(port, () => {
    console.log(`App listening port ${port}`);

    callback();
  });
};

module.exports = startServer;
