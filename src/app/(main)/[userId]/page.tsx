import { getCurrentUser } from "@/lib/session";
import { getOffersByUserIdUseCase } from "@/use-cases/offers";
import { getUserProfileUseCase } from "@/use-cases/users";
import EmptyOffers from "../dashboard/_components/empty-offers";
import OfferCard from "../dashboard/_components/offer-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Settings } from "lucide-react";
import DialogOffer from "../dashboard/_components/dialog-offer";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{
    userId: number;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const currentUser = await getCurrentUser();
  const { userId } = await params;

  const offers = await getOffersByUserIdUseCase(userId);
  const profile = await getUserProfileUseCase(userId);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = currentUser?.id == userId;

  return (
    <div>
      <div className="relative h-52 bg-gray-300 flex flex-col items-start justify-center">
        {/* Settings Icon at top right - only shown for own profile */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Link href="/dashboard/settings">
              <Settings />
            </Link>
          </div>
        )}
        {/* Avatar Image */}
        <div className="container mx-auto flex items-center gap-8 p-10">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile?.imageUrl || ""} />
            <AvatarFallback className="text-4xl">
              {profile?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <span className="mt-4 text-6xl font-semibold text-gray-800">
              {profile?.displayName || "User"}
            </span>
            <span className="text-sm text-gray-500 indent-2 break-all">
              <span
                dangerouslySetInnerHTML={{
                  __html: profile?.bio || "No bio",
                }}
              />
            </span>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-2 p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isOwnProfile ? "Your Offers" : "User's Offers"}
          </h1>
          {isOwnProfile && <DialogOffer />}
        </div>

        {offers.length === 0 && <EmptyOffers />}

        {offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
