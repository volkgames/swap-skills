import {
  createOffer,
  deleteOffer,
  getOfferById,
  getOffersByUserId,
} from "@/data-access/offers";
import { NewOffer } from "@/db/schema";
import { UserId } from "./types";
import { ForbiddenError, NotFoundError } from "./errors";
import { database } from "@/db/index";
import { offers, categories } from "@/db/schema";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

interface GetOffersParams {
  search?: string | null;
  category?: string | null;
  sortBy?: "latest" | "oldest" | null;
}

export async function getOffersUseCase({
  search,
  category,
  sortBy = "latest",
}: GetOffersParams) {
  const conditions = [];

  // Add search condition if search term is provided
  if (search) {
    conditions.push(
      sql`(${offers.offerSkill} ILIKE ${`%${search}%`} OR ${
        offers.requestSkill
      } ILIKE ${`%${search}%`} OR ${offers.description} ILIKE ${`%${search}%`})`
    );
  }

  // Add category filter if category is provided
  if (category) {
    conditions.push(eq(offers.category, category as (typeof categories.enumValues)[number]));
  }

  // Build the query
  const query = database
    .select()
    .from(offers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(sortBy === "oldest" ? asc(offers.createdAt) : desc(offers.createdAt));

  return query;
}

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
