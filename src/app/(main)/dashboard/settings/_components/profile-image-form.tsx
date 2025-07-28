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
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoaderButton } from "@/components/loader-button";
import { updateProfileImageAction } from "../actions";
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from "@/app-config";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

const uploadImageSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
    message: `Your image must be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`,
  }),
});

export function ProfileImageForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof uploadImageSchema>>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {},
  });

  const { execute: uploadImage, isPending } = useAction(
    updateProfileImageAction,
    {
      onError: ({ error }) => {
        toast.error("Failed to update profile image.", {
          description:
            error.serverError?.message || "Failed to update profile image.",
        });
      },
      onSuccess: () => {
        toast.success("Image Updated", {
          description: "You've successfully updated your profile image.",
        });
        formRef.current?.reset();
      },
    }
  );

  const onSubmit: SubmitHandler<z.infer<typeof uploadImageSchema>> = (
    values
  ) => {
    const formData = new FormData();
    formData.append("file", values.file!);
    uploadImage({ fileWrapper: formData });
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex gap-2"
      >
        <FormField
          control={form.control}
          name="file"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files && event.target.files[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton isLoading={isPending}>Upload</LoaderButton>
      </form>
    </Form>
  );
}
