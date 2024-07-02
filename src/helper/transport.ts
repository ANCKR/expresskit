import { getLogger } from "nodemailer/lib/shared";
import staticConfig from "./staticConfig";

const nodemailer = require("nodemailer");
async function getSMTPTransporter() {
  let transporter = nodemailer.createTransport({
    service: staticConfig.smtpTransporter.service,
    auth: {
      user: staticConfig.smtpTransporter.email, // your email address to send from
      pass: staticConfig.smtpTransporter.password, // your Gmail account password
    },
  });
  return transporter;
}

async function sendingMail(mailDetails: any) {
  const logger = getLogger();
  let mailOptions = {
    from: staticConfig.smtpTransporter.email, // sender address
    to: mailDetails.senderEmail, // list of receivers
    subject: mailDetails.subject, // Subject line
    text: mailDetails.text, // plain text body=
  };

  const transporter = await getSMTPTransporter();

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logger.error("error", error);
    }
    logger.info("Message sent: %s", info.messageId);
  });
}

export default sendingMail;
