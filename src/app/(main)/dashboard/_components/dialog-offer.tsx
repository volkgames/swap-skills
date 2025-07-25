"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon, Terminal } from "lucide-react";
import { z } from "zod";
import { categories } from "@/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { createOfferAction } from "../actions";
import { useAction } from "next-safe-action/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { toast } from "sonner";

const formSchema = z.object({
  offerSkill: z.string().min(1),
  requestSkill: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(categories.enumValues),
  isActive: z.boolean(),
});

export default function DialogOffer() {
  const [open, setOpen] = useState(false);
  const { execute, result, hasErrored, isPending } = useAction(
    createOfferAction,
    {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success("Offer created successfully", {
          description: "You can now view your offer in the dashboard",
          duration: 3000,
        });
      },
      onError: (error) => {
        toast.error("Failed to create offer", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offerSkill: "",
      requestSkill: "",
      description: "",
      category: "tech",
      isActive: true,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    execute(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"lg"}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" /> Create Offer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Offer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="offerSkill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Skill</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestSkill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Skill</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.enumValues.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Active</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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

            <DialogFooter>
              <DialogClose
                asChild
                disabled={isPending}
                className="disabled:opacity-50"
              >
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <LoaderButton
                type="submit"
                isLoading={isPending}
                disabled={isPending}
              >
                Create Offer
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
