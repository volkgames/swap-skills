import { ConfigurationPanel } from "@/components/config-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/session";
import { getUserProfileUseCase } from "@/use-cases/users";
import { Suspense } from "react";
import { ProfileImageForm } from "./profile-image-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function ProfileImage() {
  return (
    <ConfigurationPanel title="Profile Image">
      <Suspense fallback={<Skeleton className="w-full h-[200px] rounded" />}>
        <ProfileImageContent />
      </Suspense>
    </ConfigurationPanel>
  );
}

async function ProfileImageContent() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const profile = await getUserProfileUseCase(user.id);

  return (
    <div className="flex flex-col sm:items-center">
      <Avatar className="object-cover rounded-full w-[200px] h-[200px] mb-4 sm:mb-6">
        <AvatarImage src={profile?.imageUrl || ""} alt="Profile image" />
        <AvatarFallback className="text-4xl">
          {profile?.displayName?.charAt(0) || user.email?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <ProfileImageForm />
    </div>
  );
}
