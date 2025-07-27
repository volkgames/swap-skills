"use server";

import { rateLimitByKey } from "@/lib/limiter";
import { authenticatedActionClient } from "@/lib/safe-action";
import { createRequestUseCase } from "@/use-cases/requests";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createRequest = authenticatedActionClient
  .inputSchema(
    z.object({
      offerId: z.number(),
      message: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    await rateLimitByKey({
      key: `create-request-${ctx.user.id}`,
    });

    await createRequestUseCase({
      ...parsedInput,
      userId: ctx.user.id,
    });

    revalidatePath(`/offers/${parsedInput.offerId}`);
  });
