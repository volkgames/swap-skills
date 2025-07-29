import React, { Suspense } from "react";
import { ProfileImage } from "./_components/profile-image";
import { ProfileName } from "./_components/profile-name";
import { ConfigurationPanel } from "@/components/config-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { assertAuthenticated } from "@/lib/session";
import { getUserProfileUseCase } from "@/use-cases/users";
import { ModeToggle } from "@/components/mode-toggle";
import { EditBioForm } from "./_components/edit-bio-form";

export default function SettingsPage() {
  return (
    <div className="space-y-8 p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <ProfileImage />
        <ProfileName />
      </div>

      <ConfigurationPanel title="Profile Bio">
        <Suspense fallback={<Skeleton className="w-full h-[400px] rounded" />}>
          <BioFormWrapper />
        </Suspense>
      </ConfigurationPanel>

      <ConfigurationPanel title="Theme">
        <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center justify-between">
          <span className="mb-2 sm:mb-0">Toggle dark mode</span>
          <ModeToggle />
        </div>
      </ConfigurationPanel>
    </div>
  );
}

export async function BioFormWrapper() {
  const user = await assertAuthenticated();
  const profile = await getUserProfileUseCase(user.id);
  return <EditBioForm bio={profile.bio} />;
}
