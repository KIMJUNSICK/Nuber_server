import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";

const sendMail = mail => {
  const options = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  const transpoter = nodemailer.createTransport(sgTransport(options));
  return transpoter.sendMail(mail);
};

export const sendKeyMail = (fullName: string, email: string, key: string) => {
  const mail = {
    from: "Prismagram@prismagram.com",
    to: email,
    subject: "🔒Login Secret for Prismagram🔒",
    html: `Hello ${fullName}! Your login secret it ✅<b>${key}</b>.<br/>Copy paste on the app/website to log in`
  };
  return sendMail(mail);
};
