"use client";

import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { changeRequestStatus } from "../actions";
import { toast } from "sonner";

export default function RequestDecisionButtons({
  requestId,
  offerId,
}: {
  requestId: number;
  offerId: number;
}) {
  const { execute, isPending } = useAction(changeRequestStatus, {
    onSuccess({ input: { status } }) {
      toast.success(
        status ? "You accpeted the request" : "You declined the request"
      );
    },
    onError({ error }) {
      console.log(error);
      toast.error("Something went wrong", {
        description: error.serverError?.message ?? "Please try again later",
      });
    },
  });

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() =>
          execute({
            requestId: requestId,
            offerId: offerId,
            status: false,
          })
        }
      >
        Decline
      </Button>
      <Button
        size="sm"
        disabled={isPending}
        onClick={() =>
          execute({
            requestId: requestId,
            offerId: offerId,
            status: true,
          })
        }
      >
        Accept
      </Button>
    </>
  );
}
