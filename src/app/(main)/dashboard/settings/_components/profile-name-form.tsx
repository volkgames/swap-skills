"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoaderButton } from "@/components/loader-button";
import { updateProfileNameAction } from "../actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

const updateProfileNameSchema = z.object({
  profileName: z.string().min(1),
});

export function ProfileNameForm({ profileName }: { profileName: string }) {
  const form = useForm<z.infer<typeof updateProfileNameSchema>>({
    resolver: zodResolver(updateProfileNameSchema),
    defaultValues: {
      profileName: profileName,
    },
  });

  const { execute: updateProfileName, isPending } = useAction(
    updateProfileNameAction,
    {
      onSuccess: () => {
        toast.success("Name Updated", {
          description: "Name updated successfully.",
        });
        form.reset();
      },
      onError: ({ error }) => {
        toast.error("Failed to update profile name.", {
          description:
            error.serverError?.message || "Failed to update profile name.",
        });
      },
    }
  );

  const onSubmit: SubmitHandler<z.infer<typeof updateProfileNameSchema>> = (
    values
  ) => {
    updateProfileName(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex gap-2 flex-1"
      >
        <FormField
          control={form.control}
          name="profileName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton isLoading={isPending}>Save</LoaderButton>
      </form>
    </Form>
  );
}
