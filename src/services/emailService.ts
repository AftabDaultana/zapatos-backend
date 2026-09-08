import transport from "../config/mail.js";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailOptions) => {
  const info = await transport.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  return info;
};
