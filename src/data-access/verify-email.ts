import { database } from "@/db";
import { verifyEmailTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVerifyEmailToken(token: string) {
  const existingToken = await database.query.verifyEmailTokens.findFirst({
    where: eq(verifyEmailTokens.token, token),
  });

  return existingToken;
}

export async function deleteVerifyEmailToken(token: string) {
  await database
    .delete(verifyEmailTokens)
    .where(eq(verifyEmailTokens.token, token));
}
