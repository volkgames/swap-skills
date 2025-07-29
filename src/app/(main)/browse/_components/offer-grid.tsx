import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Offer, Profile } from "@/db/schema";

interface OfferGridProps {
  offers: Offer[];
  profiles: Map<number, Profile>;
}

export default function OfferGrid({ offers, profiles }: OfferGridProps) {
  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-16 bg-card rounded-2xl shadow-md border border-muted">
        <h2 className="text-xl font-semibold text-center">No Offers Found</h2>
        <p className="text-muted-foreground text-center">
          Try adjusting your filters or search terms to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => {
        const profile = profiles.get(offer.userId);
        
        return (
          <Card
            key={offer.id}
            className="flex flex-col justify-between h-full rounded-2xl shadow-lg border border-muted bg-background transition-transform hover:scale-[1.02] hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile?.imageUrl ?? undefined} />
                <AvatarFallback>
                  {profile?.displayName?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold break-all">
                  {offer.offerSkill}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Posted{" "}
                  {formatDistance(offer.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </CardHeader>
            <div className="px-6 py-2 flex flex-col gap-2">
              <div className="flex flex-row gap-4">
                <div>
                  <span className="font-medium text-muted-foreground">Offer:</span>{" "}
                  <span className="font-semibold break-all">{offer.offerSkill}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Request:</span>{" "}
                  <span className="font-semibold break-all">{offer.requestSkill}</span>
                </div>
              </div>
              {offer.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                  {offer.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t mt-auto">
              <Badge variant="outline" className="text-xs px-3 py-1 rounded-full">
                {offer.category}
              </Badge>
              <Button size="sm" className="font-medium" asChild>
                <Link href={`/offers/${offer.id}`}>View Details</Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
} 