"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Offer, Profile } from "@/db/schema";
import DeleteDialog from "./delete-dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteOfferAction } from "../actions";
import { toast } from "sonner";

interface OfferCardProps {
  offer: Offer;
  profile: Profile | null;
}

export default function OfferCard({ offer, profile }: OfferCardProps) {
  const { execute } = useAction(deleteOfferAction, {
    onSuccess: () => {
      toast.success("Offer deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete offer", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
  return (
    <Card className="flex flex-col justify-between h-full rounded-2xl shadow-lg border border-muted bg-background transition-transform hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <DeleteDialog
                onConfirm={() => {
                  execute({ offerId: offer.id });
                }}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <div className="px-6 py-2 flex flex-col gap-2">
        <div className="flex flex-row gap-4">
          <div>
            <span className="font-medium text-muted-foreground">Offer:</span>{" "}
            <span className="font-semibold">{offer.offerSkill}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Request:</span>{" "}
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
        <Badge variant="outline" className="text-xs px-3 py-1 rounded-full">
          {offer.category}
        </Badge>
        <Button size="sm" className="font-medium" asChild>
          <Link href={`/offers/${offer.id}/requests`}>See Requests</Link>
        </Button>
      </div>
    </Card>
  );
}
