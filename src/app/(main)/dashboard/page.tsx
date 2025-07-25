import { assertAuthenticated } from "@/lib/session";
import DialogOffer from "./_components/dialog-offer";
import { getOffersByUserIdUseCase } from "@/use-cases/offers";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserProfileUseCase } from "@/use-cases/users";
import { formatDistance } from "date-fns";
import { XIcon } from "lucide-react";
import Link from "next/link";

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

      {offers.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6 p-16 bg-card rounded-2xl shadow-md border border-muted mx-auto max-w-xl mt-12">
          <XIcon className="w-16 h-16 text-muted-foreground mb-2" />
          <h2 className="text-xl font-semibold text-center">No Offers Yet</h2>
          <p className="text-muted-foreground text-center">
            You haven&apos;t created any offers. Click &quot;Add Offer&quot; to
            get started and share your skills with the community.
          </p>
        </div>
      )}

      {offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
          {offers.map((offer) => (
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
                  <CardTitle className="text-lg font-semibold">
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
                    <span className="font-medium text-muted-foreground">
                      Offer:
                    </span>{" "}
                    <span className="font-semibold">{offer.offerSkill}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Request:
                    </span>{" "}
                    <span className="font-semibold">{offer.requestSkill}</span>
                  </div>
                </div>
                {offer.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                    {offer.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <Badge
                  variant="outline"
                  className="text-xs px-3 py-1 rounded-full"
                >
                  {offer.category}
                </Badge>
                <Link href={`/offers/${offer.id}/requests`}>
                  <Button size="sm" className="font-medium">
                    See Requests
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
