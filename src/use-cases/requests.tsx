import {
  changeRequestStatus,
  createRequest,
  getRequestById,
  getRequestsByOfferId,
} from "@/data-access/requests";
import { NewRequest } from "@/db/schema";
import { ForbiddenError, NotFoundError } from "./errors";
import { sendEmail } from "@/lib/send-email";
import { OfferAcceptedEmail } from "@/emails/offer-accepted";
import { getUser } from "@/data-access/users";
import { getOfferById } from "@/data-access/offers";
import { getProfile } from "@/data-access/profiles";
import { OfferDeclinedEmail } from "@/emails/offer-declined";

export async function createRequestUseCase(request: NewRequest) {
  console.log(request);
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

  const user = await getUser(userId);
  const profile = await getProfile(userId);
  const offer = await getOfferById(req.offerId);
  if (!user || !profile || !offer) {
    throw new NotFoundError();
  }

  const reqUser = await getUser(req.userId);
  const reqProfile = await getProfile(req.userId);
  if (!reqUser || !reqProfile) {
    throw new NotFoundError();
  }

  const request = await changeRequestStatus(requestId, userId, status);
  if (status) {
    await sendEmail(
      reqUser.email,
      "Request Accepted",
      <OfferAcceptedEmail
        offerTitle={`${profile.displayName} wants to learn ${offer.requestSkill} in exchange for ${offer.offerSkill}`}
        requesterName={reqProfile.displayName ?? reqUser.email}
        offerId={offer.id.toString()}
      />
    );
  } else {
    await sendEmail(
      reqUser.email,
      "Request Declined",
      <OfferDeclinedEmail
        offerTitle={`${profile.displayName} wants to learn ${offer.requestSkill} in exchange for ${offer.offerSkill}`}
        requesterName={profile.displayName ?? user.email}
      />
    );
  }

  return request;
}
