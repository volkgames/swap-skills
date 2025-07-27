"use server";

import { notFound } from "next/navigation";
import { getUserProfileUseCase } from "@/use-cases/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { getOfferByIdUseCase } from "@/use-cases/offers";
import RequestSection from "./_components/Request-section";
import { Suspense } from "react";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ offerId: number }>;
}) {
  const { offerId } = await params;
  const offer = await getOfferByIdUseCase(offerId);

  if (!offer) {
    return notFound();
  }

  const profile = await getUserProfileUseCase(offer.userId);
  const currentUser = await getCurrentUser();

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Offer Header */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20 shadow-lg border-2 border-primary">
            <AvatarImage src={profile.imageUrl ?? ""} />
            <AvatarFallback className="text-2xl">
              {profile.displayName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {profile.displayName}
              <span className="ml-2">
                <Badge className="text-xs px-2 py-1 rounded-full capitalize">
                  {offer.category}
                </Badge>
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Posted {formatDistanceToNow(offer.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {currentUser && currentUser.id !== offer.userId && (
            <Button size="lg" className="w-full md:w-auto">
              I&apos;m Interested
            </Button>
          )}
        </div>
      </section>

      {/* Offer Details */}
      <section className="bg-card rounded-2xl shadow-md border border-muted p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Offering
            </h3>
            <p className="text-2xl font-bold mb-4">{offer.offerSkill}</p>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Looking For
            </h3>
            <p className="text-2xl font-bold">{offer.requestSkill}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Description
            </h3>
            <p className="text-base text-muted-foreground text-wrap break-all">
              {offer.description || (
                <span className="italic text-gray-400">
                  No description provided.
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* About User */}
      <section className="bg-background rounded-2xl shadow-sm border border-muted p-6 mb-12">
        <h3 className="text-lg font-semibold text-primary mb-2">
          About {profile.displayName}
        </h3>
        <p className="text-base text-muted-foreground">
          {profile.bio || (
            <span className="italic text-gray-400">No bio available.</span>
          )}
        </p>
      </section>

      {/* Interested Users */}
      <Suspense fallback={<div>Loading...</div>}>
        <RequestSection offerId={offerId} />
      </Suspense>
    </main>
  );
}
