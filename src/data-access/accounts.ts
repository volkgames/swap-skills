import { database } from "@/db";
import { accounts } from "@/db/schema";
import { UserId } from "@/use-cases/types";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";
import { hashPassword } from "@/data-access/utils";

export async function createAccount(userId: UserId, password: string) {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);
  const [account] = await database
    .insert(accounts)
    .values({
      userId,
      accountType: "email",
      password: hash,
      salt,
    })
    .returning();
  return account;
}

export async function createAccountViaGithub(userId: UserId, githubId: string) {
  await database
    .insert(accounts)
    .values({
      userId: userId,
      accountType: "github",
      githubId,
    })
    .onConflictDoNothing()
    .returning();
}

export async function createAccountViaGoogle(userId: UserId, googleId: string) {
  await database
    .insert(accounts)
    .values({
      userId: userId,
      accountType: "google",
      googleId,
    })
    .onConflictDoNothing()
    .returning();
}

export async function getAccountByUserId(userId: UserId) {
  const account = await database.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
}

export async function updatePassword(
  userId: UserId,
  password: string,
  trx = database
) {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);
  await trx
    .update(accounts)
    .set({
      password: hash,
      salt,
    })
    .where(and(eq(accounts.userId, userId), eq(accounts.accountType, "email")));
}

export async function getAccountByGoogleId(googleId: string) {
  return await database.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId),
  });
}

export async function getAccountByGithubId(githubId: string) {
  return await database.query.accounts.findFirst({
    where: eq(accounts.githubId, githubId),
  });
}
