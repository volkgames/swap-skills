"use server";

import { authenticatedActionClient } from "@/lib/safe-action";
import z from "zod";
import { rateLimitByKey } from "@/lib/limiter";
import { revalidatePath } from "next/cache";
import {
  updateProfileBioUseCase,
  updateProfileImageUseCase,
  updateProfileNameUseCase,
} from "@/use-cases/users";
import sanitizeHtml from "sanitize-html";

export const updateProfileImageAction = authenticatedActionClient
  .inputSchema(
    z.object({
      fileWrapper: z.instanceof(FormData),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    await rateLimitByKey({
      key: `update-profile-image-${ctx.user.id}`,
      limit: 3,
      window: 60000,
    });
    const file = parsedInput.fileWrapper.get("file") as File;
    await updateProfileImageUseCase(file, ctx.user.id);
    revalidatePath(`/dashboard`);
  });

export const updateProfileNameAction = authenticatedActionClient
  .inputSchema(
    z.object({
      profileName: z.string().min(1),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    await updateProfileNameUseCase(ctx.user.id, parsedInput.profileName);
    revalidatePath(`/dashboard/settings/profile`);
  });

export const updateProfileBioAction = authenticatedActionClient
  .inputSchema(
    z.object({
      bio: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    await updateProfileBioUseCase(ctx.user.id, sanitizeHtml(parsedInput.bio));
    revalidatePath(`/dashboard/settings/profile`);
  });
