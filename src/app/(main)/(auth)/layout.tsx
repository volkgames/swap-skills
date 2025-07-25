import { assertAuthenticated } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await assertAuthenticated();

  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
