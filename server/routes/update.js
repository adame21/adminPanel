var express = require("express");
var router = express.Router();
var sqlConnection = require("../DB/adminPanel");

router.post("/agencies", async (req, res) => {
  try {
    console.log(req.body);

    var insertQuery = `
          update agentsadmin.agencies
          set name = '${req.body.agencyName}', web_site = '${req.body.website}', phone = '${req.body.phone}', package_id = ${req.body.packageId}, subscription_end_date = DATE_ADD("${req.body.subscription}", INTERVAL 1 DAY)
          where id=${req.body.id}
          `;

    sqlConnection.query(insertQuery, function(err, result) {
      if (err) throw err;

      res.send(result);
    });
  } catch (err) {
    console.log(`error: ${err.message} / stack: ${err.stack}`);
    res.send([]);
  }
});

router.post("/agents", async (req, res) => {
  try {
    console.log(req.body);

    var insertQuery = `
          update agentsadmin.agents
          set name = '${req.body.agentName}', cellular = '${req.body.cellular}', password = '${req.body.password}', agency_id = ${req.body.agency}, license_id = ${req.body.license}
          where id=${req.body.id}
          `;

    sqlConnection.query(insertQuery, function(err, result) {
      if (err) throw err;

      res.send(result);
    });
  } catch (err) {
    console.log(`error: ${err.message} / stack: ${err.stack}`);
    res.send([]);
  }
});

module.exports = router;
