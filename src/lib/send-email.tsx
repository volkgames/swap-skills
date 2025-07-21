import { ReactNode } from "react";

export async function sendEmail(
  email: string,
  subject: string,
  body: ReactNode
) {
  // TODO: implement me
  console.log(email, subject, body);
}

// TODO: implement me
// export async function batchSendEmails(
//   emails: {
//     to: string;
//     subject: string;
//     body: ReactNode;
//   }[]
// ) {
//   const { error } = await resend.batch.send(
//     emails.map((email) => ({
//       from: EMAIL_FROM,
//       to: email.to,
//       subject: email.subject,
//       react: email.body,
//     })
//   );
//   if (error) {
//     throw error;
//   }
// }
