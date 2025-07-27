import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserProfileUseCase } from "@/use-cases/users";
import { getRequestsByOfferIdUseCase } from "@/use-cases/requests";
import { formatDistanceToNow } from "date-fns";
import { getCurrentUser } from "@/lib/session";

export default async function RequestSection({ offerId }: { offerId: number }) {
  const requests = await getRequestsByOfferIdUseCase(offerId);
  const currentUser = await getCurrentUser();

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Interested Users</h2>
      <div className="space-y-4">
        {requests.map(async (req) => {
          const profile = await getUserProfileUseCase(req.userId);
          return (
            <Card key={req.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={profile.imageUrl ?? ""} />
                    <AvatarFallback>
                      {profile.displayName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{profile.displayName}</h3>
                      <Badge variant={req.accepted ? "default" : "secondary"}>
                        {req.accepted ? "Accepted" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDistanceToNow(req.createdAt, { addSuffix: true })}
                    </p>
                    <p className="mt-2">{req.message}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!req.accepted &&
                    currentUser &&
                    currentUser.id === req.userId && (
                      <>
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                        <Button size="sm">Accept</Button>
                      </>
                    )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
