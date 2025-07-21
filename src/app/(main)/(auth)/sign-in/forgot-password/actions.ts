"use server";

import { resetPasswordUseCase } from "@/data-access/users";
import { rateLimitByKey } from "@/lib/limiter";
import { unauthenticatedActionClient } from "@/lib/safe-action";
import { z } from "zod";

export const resetPasswordAction = unauthenticatedActionClient
  .inputSchema(z.object({ email: z.email() }))
  .action(async ({ parsedInput: { email } }) => {
    await rateLimitByKey({ key: email, limit: 1, window: 30000 });
    await resetPasswordUseCase(email);
  });
