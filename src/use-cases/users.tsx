import {
  createAccount,
  createAccountViaGithub,
  createAccountViaGoogle,
} from "@/data-access/accounts";
import {
  getUserByEmail,
  createUser,
  verifyPassword,
  updateUser,
} from "@/data-access/users";
import { LoginError, PublicError } from "./errors";
import { createProfile, getProfile } from "@/data-access/profiles";
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "./verify-email";
import { applicationName } from "@/app-config";
import { sendEmail } from "@/lib/send-email";
import { VerifyEmail } from "@/emails/verify-email";
import { UserId } from "./types";
import { GoogleUser } from "@/app/(main)/api/login/google/callback/route";
import { GitHubUser } from "@/app/(main)/api/login/github/callback/route";

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new PublicError("User not found");
  }

  return profile;
}

export async function registerUserUseCase(
  displayName: string,
  email: string,
  password: string
) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new PublicError("An user with that email already exists.");
  }
  const user = await createUser(email);
  await createAccount(user.id, password);

  await createProfile(user.id, displayName);

  try {
    const token = await createVerifyEmailToken(user.id);
    await sendEmail(
      email,
      `Verify your email for ${applicationName}`,
      <VerifyEmail token={token} />
    );
  } catch (error) {
    console.error("Verification email would not be sent.", error);
  }

  return { id: user.id };
}

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new LoginError();
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  return { id: user.id };
}

export async function verifyEmailUseCase(token: string) {
  const tokenEntry = await getVerifyEmailToken(token);

  if (!tokenEntry) {
    throw new PublicError("Invalid token");
  }

  const userId = tokenEntry.userId;

  await updateUser(userId, { emailVerified: new Date() });
  await deleteVerifyEmailToken(token);
  return userId;
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email);
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub);

  await createProfile(existingUser.id, googleUser.name, googleUser.picture);

  return existingUser.id;
}

export async function createGithubUserUseCase(githubUser: GitHubUser) {
  let existingUser = await getUserByEmail(githubUser.email);

  if (!existingUser) {
    existingUser = await createUser(githubUser.email);
  }

  await createAccountViaGithub(existingUser.id, githubUser.id);

  await createProfile(existingUser.id, githubUser.login, githubUser.avatar_url);

  return existingUser.id;
}
