"use server";

import { authenticatedActionClient } from "@/lib/safe-action";
import z from "zod";
import { categories } from "@/db/schema";
import { rateLimitByKey } from "@/lib/limiter";
import { revalidatePath } from "next/cache";
import { createOfferUseCase } from "@/use-cases/offers";

export const createOfferAction = authenticatedActionClient
  .inputSchema(
    z.object({
      offerSkill: z.string().min(1),
      requestSkill: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(categories.enumValues),
      isActive: z.boolean(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    await rateLimitByKey({
      key: `create-offer-${user.id}`,
    });

    await createOfferUseCase({
      ...parsedInput,
      userId: user.id,
    });

    revalidatePath("/dashboard");
  });
