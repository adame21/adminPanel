var express = require("express");
var router = express.Router();
var sqlConnection = require("../DB/adminPanel");

router.post("/agencies", async (req, res) => {
  try {
    console.log(req.body);

    var insertQuery = `
      insert into agentsadmin.agencies
      (name, web_site, phone, package_id, subscription_end_date)
      values( "${req.body.agencyName}", "${req.body.website}", "${req.body.phone}", ${req.body.package}, DATE_ADD("${req.body.subscription}", INTERVAL 1 DAY) )
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
