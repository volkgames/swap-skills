import {
  createOffer,
  deleteOffer,
  getOfferById,
  getOffersByUserId,
} from "@/data-access/offers";
import { UserId } from "./types";
import { ForbiddenError, NotFoundError } from "./errors";
import { database } from "@/db/index";
import { offers, categories, NewOffer } from "@/db/schema";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { offerPageSize } from "@/app-config";
interface GetOffersParams {
  search?: string | null;
  category?: string | null;
  sortBy?: "latest" | "oldest" | null;
  page?: number;
  limit?: number;
}

export async function getOffersUseCase({
  search,
  category,
  sortBy = "latest",
  page = 1,
  limit = offerPageSize,
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
    conditions.push(
      eq(offers.category, category as (typeof categories.enumValues)[number])
    );
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  // Get total count for pagination
  const totalCountQuery = await database
    .select({ count: sql<number>`count(*)` })
    .from(offers)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const totalCount = Number(totalCountQuery[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  // Get paginated results
  const results = await database
    .select()
    .from(offers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(
      sortBy === "oldest" ? asc(offers.createdAt) : desc(offers.createdAt)
    )
    .limit(limit)
    .offset(offset);

  return {
    offers: results,
    pagination: {
      total: totalCount,
      totalPages,
      currentPage: page,
      limit,
    },
  };
}

export async function getOfferByIdUseCase(offerId: number) {
  const offer = await getOfferById(offerId);
  return offer;
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
