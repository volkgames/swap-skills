import { googleAuth } from "@/auth";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = googleAuth.createAuthorizationURL(state, codeVerifier, [
    "profile",
    "email",
  ]);

  const allCookies = await cookies();

  allCookies.set("google_oauth_state", state, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  });

  allCookies.set("google_code_verifier", codeVerifier, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  });

  return Response.redirect(url);
}
