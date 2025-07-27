import { database } from "@/db";
import { NewRequest, requests } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getRequestsByOfferId(offerId: number) {
    const reqs = await database
    .select()
    .from(requests)
    .where(eq(requests.offerId, offerId))
    .orderBy(desc(requests.createdAt))

    return reqs;
}

export async function createRequest(request: NewRequest) {
    const [newRequest] = await database
    .insert(requests)
    .values(request)
    .returning();

    return newRequest;
}