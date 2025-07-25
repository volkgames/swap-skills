import { offers, NewOffer } from "@/db/schema";
import { database } from "@/db";
import { desc, eq } from "drizzle-orm";
import { UserId } from "@/use-cases/types";

export async function createOffer(props: NewOffer) {
  const [offer] = await database
    .insert(offers)
    .values({
      ...props,
    })
    .returning();

  return offer;
}

export async function getOffersByUserId(userId: UserId) {
  const ofs = await database
    .select()
    .from(offers)
    .where(eq(offers.userId, userId))
    .orderBy(desc(offers.createdAt));

  return ofs;
}

export async function getOfferById(offerId: number) {
  const offer = await database.query.offers.findFirst({
    where: eq(offers.id, offerId),
  });

  return offer;
}

export async function deleteOffer(offerId: number) {
  await database.delete(offers).where(eq(offers.id, offerId));
}
