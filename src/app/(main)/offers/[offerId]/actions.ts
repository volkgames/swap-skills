"use server";

import { rateLimitByKey } from "@/lib/limiter";
import { authenticatedActionClient } from "@/lib/safe-action";
import {
  changeRequestStatusUseCase,
  createRequestUseCase,
} from "@/use-cases/requests";
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

export const changeRequestStatus = authenticatedActionClient
  .inputSchema(
    z.object({
      requestId: z.number(),
      offerId: z.number(),
      status: z.boolean(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { requestId, offerId, status } = parsedInput;

    await rateLimitByKey({
      key: `accept-request-${ctx.user.id}`,
    });

    await changeRequestStatusUseCase(requestId, ctx.user.id, status);

    revalidatePath(`/offers/${offerId}`);
  });
