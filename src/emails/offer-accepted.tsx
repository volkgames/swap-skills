import * as React from "react";

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "@/env";
import { applicationName } from "@/app-config";

export const BASE_URL = env.HOST_NAME;

interface OfferAcceptedEmailProps {
  offerTitle: string;
  requesterName: string;
  offerId: string;
}

export function OfferAcceptedEmail({ offerTitle, requesterName, offerId }: OfferAcceptedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your request has been accepted!</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
              <Section className="text-center mt-[32px] mb-[32px]">
                <Text className="text-black font-medium text-[20px] leading-[24px] mb-8">
                  Good news! 🎉
                </Text>

                <Text className="text-black text-[14px] leading-[24px] mb-4">
                  {requesterName} has accepted your request for the offer:
                </Text>

                <Text className="text-black font-medium text-[16px] leading-[24px] mb-8">
                  &quot;{offerTitle}&quot;
                </Text>

                <Text className="text-black text-[14px] leading-[24px] mb-4">
                  You can now proceed with arranging the details of your skill exchange.
                  Visit the offer page to continue the conversation and set up your meeting.
                </Text>

                <Text className="text-black text-[14px] leading-[24px] mb-4">
                  <a
                    href={`${BASE_URL}/offers/${offerId}`}
                    target="_blank"
                    className="text-[#2754C5] underline"
                    rel="noreferrer"
                  >
                    View Offer Details
                  </a>
                </Text>
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Text className="text-[#666666] text-[12px] leading-[24px] flex items-center justify-center">
                © 2024 {applicationName}. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
} 