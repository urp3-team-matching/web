import { Resend } from "resend";

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
  const resend = new Resend(process.env.RESEND_API_KEY);
  let lastError;
  for (let i = 0; i < EMAIL_SEND_RETRY_COUNT; i++) {
    try {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject,
        html,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
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
