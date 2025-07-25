import { getOffersUseCase } from "@/use-cases/offers";
import SearchBar from "./_components/search-bar";
import Filters from "./_components/filters";
import OfferGrid from "./_components/offer-grid";
import { getUserProfileUseCase } from "@/use-cases/users";
import Pagination from "./_components/pagination";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  
  const { offers, pagination } = await getOffersUseCase({
    search: searchParams.search,
    category: searchParams.category,
    sortBy: searchParams.sortBy as "latest" | "oldest",
    page: currentPage,
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
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Browse Skills</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 space-y-4">
            <SearchBar />
            <Filters />
          </div>
          
          <div className="flex-1 space-y-6">
            <OfferGrid 
              offers={offers} 
              profiles={profileMap}
            />
            
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 