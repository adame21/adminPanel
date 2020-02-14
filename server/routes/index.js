var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", (req, res) => {
  var userName = req.body.userName;
  var password = req.body.password;

  if (validate(userName, password)) {
    res.status(200).send({
      response: userName,
      page: "home"
    });
  } else {
    res.status(400).send({
      response: "bad info"
    });
  }
});

function validate(userName, password) {
  if (userName == "admin" && password == "admin") {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
