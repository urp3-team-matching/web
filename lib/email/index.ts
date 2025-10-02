import { env } from "@/lib/env";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

export default async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions: MailOptions = {
    from: env.EMAIL_SERVER_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      `Error sending email to ${to} with subject ${subject}`,
      error
    );
  }
}
