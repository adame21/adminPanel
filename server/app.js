var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var addRouter = require("./routes/add");
var selectRouter = require("./routes/select");
var updateRouter = require("./routes/update");
var deleteRouter = require("./routes/delete");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/add", addRouter);
app.use("/select", selectRouter);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);

module.exports = app;
