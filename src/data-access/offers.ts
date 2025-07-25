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
