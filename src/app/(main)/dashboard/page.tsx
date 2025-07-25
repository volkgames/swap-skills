import { assertAuthenticated } from "@/lib/session";
import DialogOffer from "./_components/dialog-offer";
import { getOffersByUserIdUseCase } from "@/use-cases/offers";
import { getUserProfileUseCase } from "@/use-cases/users";
import EmptyOffers from "./_components/empty-offers";
import OfferCard from "./_components/offer-card";

export default async function DashboardPage() {
  const user = await assertAuthenticated();
  const offers = await getOffersByUserIdUseCase(user.id);
  const profile = await getUserProfileUseCase(user.id);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between p-10">
        <h1 className="text-2xl font-bold">Your Offers</h1>
        <DialogOffer />
      </div>

      {offers.length === 0 && <EmptyOffers />}

      {offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              profile={profile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
