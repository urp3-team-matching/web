import { Resend } from "resend";

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
  } catch (error) {
    console.error(
      `Error sending email to ${to} with subject ${subject}`,
      error
    );
  }
}
