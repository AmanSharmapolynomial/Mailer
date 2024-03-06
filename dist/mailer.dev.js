"use strict";

var nodemailer = require("nodemailer");

var fs = require("fs");

var transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS
  }
});

function MailSender() {
  var info;
  return regeneratorRuntime.async(function MailSender$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: '"Aman Sharma 👻" <aman@ethereal.email>',
            // sender address
            to: "amansharma@gmail.com",
            // list of receivers
            subject: "Hello ✔",
            // Subject line
            html: "<b>Hello world?</b>",
            // html body
            attachments: [{
              filename: "AllSheets.xlsx",
              path: "./excelSheets/AllSheets.xlsx"
            }]
          }));

        case 2:
          info = _context.sent;
          console.log("Message sent successfully");

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = MailSender;