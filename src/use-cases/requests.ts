import {
  changeRequestStatus,
  createRequest,
  getRequestById,
  getRequestsByOfferId,
} from "@/data-access/requests";
import { NewRequest } from "@/db/schema";
import { ForbiddenError, NotFoundError } from "./errors";

export async function createRequestUseCase(request: NewRequest) {
  const newRequest = await createRequest(request);
  return newRequest;
}

export async function getRequestsByOfferIdUseCase(offerId: number) {
  const requests = await getRequestsByOfferId(offerId);

  return requests;
}

export async function changeRequestStatusUseCase(
  requestId: number,
  userId: number,
  status: boolean
) {
  const req = await getRequestById(requestId);
  if (!req) {
    throw new NotFoundError();
  }
  
  if (req.userId !== userId) {
    throw new ForbiddenError();
  }

  const request = await changeRequestStatus(requestId, userId, status);

  return request;
}
