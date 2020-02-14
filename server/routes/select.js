var express = require("express");
var router = express.Router();
var sqlConnection = require("../DB/adminPanel");

router.get("/agencies", async (req, res) => {
  try {
    sqlConnection.query("SELECT * FROM agentsadmin.agencies", function(
      err,
      result
    ) {
      if (err) throw err;

      res.send(result);
    });
  } catch (err) {
    res.send([]);
  }
});

router.get("/packages", async (req, res) => {
  sqlConnection.query("SELECT * FROM agentsadmin.packages", function(
    err,
    result
  ) {
    if (err) throw err;

    res.send(result);
  });
});

module.exports = router;
