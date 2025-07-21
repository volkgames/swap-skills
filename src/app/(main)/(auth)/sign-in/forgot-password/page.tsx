"use client";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { resetPasswordAction } from "@/app/(main)/(auth)/sign-in/forgot-password/actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

const registrationSchema = z.object({
  email: z.email(),
});

export default function ForgotPasswordPage() {
  const { execute, isPending, hasSucceeded } = useAction(resetPasswordAction, {
    onError({ error }) {
      toast.error("Something went wrong", {
        description: error.thrownError?.message,
      });
    },
  });

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    execute(values);
  }

  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      <h1 className="page-title text-center">Forgot Password</h1>

      {hasSucceeded && (
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Reset link sent</AlertTitle>
          <AlertDescription>
            We have sent you an email with a link to reset your password.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Enter your email"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoaderButton isLoading={isPending} className="w-full" type="submit">
            Send Reset Email
          </LoaderButton>
        </form>
      </Form>
    </div>
  );
}
