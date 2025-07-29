import { assertAuthenticated } from "@/lib/session";
import DialogOffer from "./_components/dialog-offer";
import { getOffersByUserIdUseCase } from "@/use-cases/offers";
import { getUserProfileUseCase } from "@/use-cases/users";
import EmptyOffers from "./_components/empty-offers";
import OfferCard from "./_components/offer-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Settings } from "lucide-react";

export default async function DashboardPage() {
  const user = await assertAuthenticated();
  const offers = await getOffersByUserIdUseCase(user.id);
  const profile = await getUserProfileUseCase(user.id);

  return (
    <div>
      <div className="relative h-52 bg-gray-300 flex flex-col items-start justify-center">
        {/* Settings Icon at top right */}
        <div className="absolute top-4 right-4">
          <Link href="/dashboard/settings">
            <Settings />
          </Link>
        </div>
        {/* Avatar Image */}
        <div className="container mx-auto flex items-center gap-8 p-10">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile?.imageUrl || ""} />
            <AvatarFallback className="text-4xl">
              {profile?.displayName?.charAt(0) || user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <span className="mt-4 text-6xl font-semibold text-gray-800">
              {profile?.displayName || user.email || "Your Name"}
            </span>
            <span className="text-sm text-gray-500 indent-2">
              {profile?.bio || "No bio"}
            </span>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-2 p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Offers</h1>
          <DialogOffer />
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
