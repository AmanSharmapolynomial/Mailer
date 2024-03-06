"use strict";

var express = require("express");

var connectDb = require("./connection");

var cron = require("node-cron");

var MailSender = require("./mailer");

var SHEETDATA = require("./getSheets/sheet");

var app = express();
var PORT = 3000;
connectDb(); // Scheduling the mail at 11:59 pm Daily so that the full day is covered
// cron.schedule(`59 23 * * * `, async () => {
// });

SHEETDATA();
app.listen(PORT, function () {
  console.log("Server Running on Port ", PORT);
});