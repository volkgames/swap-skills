"use server";

import { z } from "zod";
import { unauthenticatedActionClient } from "@/lib/safe-action";
import { setSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { afterLoginUrl } from "@/app-config";
import { rateLimitByIp } from "@/lib/limiter";
import { registerUserUseCase } from "@/use-cases/users";

export const signUpAction = unauthenticatedActionClient
  .schema(
    z.object({
      displayName: z.string().min(3),
      email: z.email(),
      password: z.string().min(8),
    })
  )
  .action(async ({ parsedInput }) => {
    const { displayName, email, password } = parsedInput;

    await rateLimitByIp({ key: "register", limit: 3, window: 30000 });
    const user = await registerUserUseCase(displayName, email, password);
    await setSession(user.id);
    return redirect(afterLoginUrl);
  });
