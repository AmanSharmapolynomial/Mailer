const express = require("express");
const connectDb = require("./connection");

const cron = require("node-cron");
const MailSender = require("./mailer");
const SHEETDATA = require("./getSheets/sheet");

const app = express();
const PORT = 3000;

connectDb();

// Scheduling the mail at 11:59 pm Daily so that the full day is covered
// cron.schedule(`59 23 * * * `, async () => {
// });

SHEETDATA();
app.listen(PORT, () => {
  console.log(`Server Running on Port `, PORT);
});
