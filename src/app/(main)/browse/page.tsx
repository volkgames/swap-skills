import { getOffersUseCase } from "@/use-cases/offers";
import SearchBar from "./_components/search-bar";
import Filters from "./_components/filters";
import OfferGrid from "./_components/offer-grid";
import { getUserProfileUseCase } from "@/use-cases/users";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const offers = await getOffersUseCase({
    search: searchParams.search,
    category: searchParams.category,
    sortBy: searchParams.sortBy as "latest" | "oldest",
  });

  // Get all user profiles for the offers
  const userIds = [...new Set(offers.map((offer) => offer.userId))];
  const profiles = await Promise.all(
    userIds.map((userId) => getUserProfileUseCase(userId))
  );

  // Create a map of user profiles for easy lookup
  const profileMap = new Map(
    profiles.map((profile, index) => [userIds[index], profile])
  );

  return (
    <div className="container mx-auto py-8 px-10">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Browse Skills</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 space-y-4">
            <SearchBar />
            <Filters />
          </div>
          
          <div className="flex-1">
            <OfferGrid 
              offers={offers} 
              profiles={profileMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 