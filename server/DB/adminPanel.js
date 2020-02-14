var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "7799585",
  database: "agentsadmin"
});

connection.connect(function(err) {
  if (err) throw err;
});



module.exports = connection;
