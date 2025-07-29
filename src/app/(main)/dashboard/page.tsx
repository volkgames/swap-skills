import { assertAuthenticated } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await assertAuthenticated();
  redirect(`/${user.id}`);
}
