import { Loader2Icon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { VariantProps } from "class-variance-authority";

export function LoaderButton({
  children,
  isLoading,
  className,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    isLoading: boolean;
    asChild?: boolean;
  }) {
  return (
    <Button
      disabled={isLoading}
      type="submit"
      {...props}
      className={cn("flex gap-2 justify-center px-3", className)}
    >
      {isLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
      {children}
    </Button>
  );
}
