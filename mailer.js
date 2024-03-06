const nodemailer = require("nodemailer");

const fs = require("fs");
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS
  }
});

async function MailSender() {

  const info = await transporter.sendMail({
    from: '"Aman Sharma 👻" <aman@ethereal.email>', // sender address
    to: "amansharma@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    html: "<b>Hello world?</b>", // html body

    attachments: [
      {
        filename: "AllSheets.xlsx",
        path: "./excelSheets/AllSheets.xlsx"
      }
    ]
  });

  console.log("Message sent successfully");
}

module.exports = MailSender;
