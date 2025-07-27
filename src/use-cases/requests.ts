import { createRequest, getRequestsByOfferId } from "@/data-access/requests";
import { NewRequest } from "@/db/schema";

export async function createRequestUseCase(request: NewRequest) {
  const newRequest = await createRequest(request);
  return newRequest;
}

export async function getRequestsByOfferIdUseCase(offerId: number) {
  const requests = await getRequestsByOfferId(offerId);

  return requests;
}
