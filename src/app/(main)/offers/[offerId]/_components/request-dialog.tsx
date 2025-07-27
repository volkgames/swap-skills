"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { User } from "@/db/schema";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createRequest } from "../actions";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});

export default function RequestDialog({
  offerId,
  user,
}: {
  offerId: number;
  user: User | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { execute, isPending, result, hasErrored } = useAction(createRequest, {
    onSuccess: () => {
      setIsOpen(false);
      form.reset();
      toast.success("Request sent successfully", {
        description: "You will be notified when the offer is accepted",
      });
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message ?? "Please try again",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    execute({
      offerId,
      message: values.message,
    });
  }

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Request Swap</Button>
      </DialogTrigger>
      <DialogContent>
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle>Request Swap</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasErrored && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {result?.serverError?.message ??
                        "Something went wrong, please try again"}
                    </AlertDescription>
                  </Alert>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isPending}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Requesting..." : "Request Swap"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request Swap</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Please sign in to request a swap
            </DialogDescription>
            <DialogFooter>
              <Button asChild>
                <Link href="/sign-in" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
