/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateRequest } from "@/auth";
import { env } from "@/env";
import { AuthenticationError, PublicError } from "@/use-cases/errors";
import { createSafeActionClient } from "next-safe-action";

export const unauthenticatedActionClient = createSafeActionClient({
  handleServerError: (error: Error) => {
    const isAllowedError = error instanceof PublicError;
    // let's all errors pass through to the UI so debugging locally is easier
    const isDev = env.NODE_ENV === "development";
    if (isAllowedError || isDev) {
      console.error(error);
      return {
        code: error.name ?? "ERROR",
        message: `${!isAllowedError && isDev ? "DEV ONLY ENABLED - " : ""}${
          error.message
        }`,
      };
    } else {
      return {
        code: "ERROR",
        message: "Something went wrong",
      };
    }
  },
});

export const authenticatedActionClient = unauthenticatedActionClient.use(
  async ({ next }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      throw new AuthenticationError();
    }

    return next({
      ctx: {
        session,
        user,
      },
    });
  }
);
