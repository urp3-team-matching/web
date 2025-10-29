import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

const EMAIL_SEND_RETRY_COUNT = 3;

export default async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  let lastError;
  for (let i = 0; i < EMAIL_SEND_RETRY_COUNT; i++) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
      const mailOptions: MailOptions = {
        from: process.env.EMAIL_SERVER_USER,
        to,
        subject,
        html,
      };
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to} with subject ${subject}`);
      return;
    } catch (error) {
      lastError = error;
      if (i < EMAIL_SEND_RETRY_COUNT - 1) {
        await new Promise((res) => setTimeout(res, 500 * (i + 1)));
      }
    }
  }
  console.error(
    `Error sending email to ${to} with subject ${subject} (after ${EMAIL_SEND_RETRY_COUNT} attempts)`,
    lastError
  );
}
