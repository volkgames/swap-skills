import { database } from "@/db";
import { NewRequest, requests } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getRequestsByOfferId(offerId: number) {
  const reqs = await database
    .select()
    .from(requests)
    .where(eq(requests.offerId, offerId))
    .orderBy(desc(requests.createdAt));

  return reqs;
}

export async function getRequestById(requestId: number) {
  const [request] = await database
    .select()
    .from(requests)
    .where(eq(requests.id, requestId));

  return request;
}

export async function createRequest(request: NewRequest) {
  const [newRequest] = await database
    .insert(requests)
    .values(request)
    .returning();

  return newRequest;
}

export async function changeRequestStatus(
  requestId: number,
  userId: number,
  status: boolean
) {
  const [updatedRequest] = await database
    .update(requests)
    .set({
      accepted: status,
    })
    .where(and(eq(requests.id, requestId), eq(requests.userId, userId)))
    .returning();

  return updatedRequest;
}
