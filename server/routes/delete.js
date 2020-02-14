var express = require("express");
var router = express.Router();
var sqlConnection = require("../DB/adminPanel");

router.post("/agencies", async (req, res) => {
  try {


    var deleteQuery = `
        DELETE FROM agentsadmin.agencies where id=${req.body.id}
      `;

    sqlConnection.query(deleteQuery, function(err, result) {
      if (err) throw err;

      res.send(result);
    });
  } catch (err) {
    console.log(`error: ${err.message} / stack: ${err.stack}`);
    res.send([]);
  }
});

module.exports = router;
