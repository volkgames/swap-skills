import { createOffer, getOffersByUserId } from "@/data-access/offers";
import { NewOffer } from "@/db/schema";
import { UserId } from "./types";

export async function createOfferUseCase(
  props: NewOffer
) {
  const offer = await createOffer(props);

  return offer;
}

export async function getOffersByUserIdUseCase(userId: UserId) {
  const offers = await getOffersByUserId(userId);
  return offers;
}
