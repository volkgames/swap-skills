"use server";

import { afterLoginUrl } from "@/app-config";
import { rateLimitByKey } from "@/lib/limiter";
import { unauthenticatedActionClient } from "@/lib/safe-action";
import { setSession } from "@/lib/session";
import { signInUseCase } from "@/use-cases/users";
import { redirect } from "next/navigation";
import { z } from "zod";

export const signInAction = unauthenticatedActionClient
  .inputSchema(z.object({ email: z.email(), password: z.string().min(8) }))
  .action(async ({ parsedInput: { email, password } }) => {
   
    await rateLimitByKey({ key: email, limit: 3, window: 10000 });
    const user = await signInUseCase(email, password);
    await setSession(user.id);
    redirect(afterLoginUrl);
  });