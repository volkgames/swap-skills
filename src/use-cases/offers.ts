import {
  createOffer,
  deleteOffer,
  getOfferById,
  getOffersByUserId,
} from "@/data-access/offers";
import { NewOffer } from "@/db/schema";
import { UserId } from "./types";
import { ForbiddenError, NotFoundError } from "./errors";

export async function createOfferUseCase(props: NewOffer) {
  const offer = await createOffer(props);

  return offer;
}

export async function getOffersByUserIdUseCase(userId: UserId) {
  const offers = await getOffersByUserId(userId);
  return offers;
}

export async function deleteOfferUseCase(offerId: number, userId: UserId) {
  const offer = await getOfferById(offerId);

  if (!offer) {
    throw new NotFoundError();
  }

  if (offer.userId !== userId) {
    throw new ForbiddenError();
  }

  await deleteOffer(offerId);
}
