"use server";

import { invalidateSession, validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const { session } = await validateRequest();

  if (!session) {
    redirect("/sign-in");
  }

  await invalidateSession(session.id);
  redirect("/signed-out");
}
