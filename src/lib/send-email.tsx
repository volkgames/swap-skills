import { env } from "@/env";
import { ReactNode } from "react";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(
  email: string,
  subject: string,
  body: ReactNode
) {
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: subject,
    react: body,
  });

  console.log(data, error);
}

export async function batchSendEmails(
  emails: {
    to: string;
    subject: string;
    body: ReactNode;
  }[]
) {
  const { error } = await resend.batch.send(
    emails.map((email) => ({
      from: env.EMAIL_FROM,
      to: email.to,
      subject: email.subject,
      react: email.body,
    }))
  );
  if (error) {
    throw error;
  }
}
