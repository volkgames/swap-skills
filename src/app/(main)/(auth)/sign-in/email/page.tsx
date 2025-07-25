"use client";

import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { signInAction } from "@/app/(main)/(auth)/sign-in/email/actions";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignInPage() {
  const { execute, isPending, hasErrored, result } = useAction(signInAction, {
    onError({ error }) {
      toast.error("Something went wrong", {
        description: error.thrownError?.message,
      });
    },
    onSuccess() {
      toast.success("Let's Go!", {
        description: "Enjoy your session",
      });
    },
  });

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    execute(values);
  }

  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      <h1 className="page-title text-center">Sign In</h1>

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Enter your password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasErrored && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {result.serverError?.message}
              </AlertDescription>
            </Alert>
          )}

          <LoaderButton isLoading={isPending} className="w-full" type="submit">
            Sign In
          </LoaderButton>
        </form>
      </Form>

      <div className="flex justify-center">
        <Button asChild variant="link">
          <Link href="/sign-in/forgot-password">Forgot Password</Link>
        </Button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
            Or
          </span>
        </div>
      </div>

      <Button className="w-full" variant={"secondary"}>
        <Link href="/sign-up">Create an account</Link>
      </Button>
    </div>
  );
}
