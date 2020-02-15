var express = require("express");
var router = express.Router();
var sqlConnection = require("../DB/adminPanel");

router.get("/agencies/all", async (req, res) => {
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

router.get("/agencies", async (req, res) => {
  try {
    sqlConnection.query(
      `SELECT * FROM agentsadmin.agencies
       WHERE 1=1
       ${
         req.query.searchName ? "and name = '" + req.query.searchName + "'" : ""
       }
       ${
         req.query.searchPhone
           ? "and phone = '" + req.query.searchPhone + "'"
           : ""
       }
       `,
      function(err, result) {
        if (err) throw err;
        res.send(result);
      }
    );
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

router.get("/agents", async (req, res) => {
  try {
    sqlConnection.query(
      `SELECT * FROM agentsadmin.agents
       WHERE 1=1
       ${
         req.query.searchName ? "and name = '" + req.query.searchName + "'" : ""
       }
       ${
         req.query.searchPhone
           ? "and cellular = '" + req.query.searchPhone + "'"
           : ""
       }
       ${
         req.query.searchAgency != "none"
           ? "and agency_id = '" + req.query.searchAgency + "'"
           : ""
       }
       `,
      function(err, result) {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (err) {
    res.send([]);
  }
});

router.get("/agents/all", async (req, res) => {
  try {
    sqlConnection.query("SELECT * FROM agentsadmin.agents", function(
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

module.exports = router;
