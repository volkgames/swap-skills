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

interface OfferDeclinedEmailProps {
  offerTitle: string;
  requesterName: string;
  reason?: string;
}

export function OfferDeclinedEmail({ offerTitle, requesterName, reason }: OfferDeclinedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Update on your skill exchange request</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
              <Section className="text-center mt-[32px] mb-[32px]">
                <Text className="text-black font-medium text-[20px] leading-[24px] mb-8">
                  Update on Your Request
                </Text>

                <Text className="text-black text-[14px] leading-[24px] mb-4">
                  {requesterName} has reviewed your request for the offer:
                </Text>

                <Text className="text-black font-medium text-[16px] leading-[24px] mb-8">
                  &quot;{offerTitle}&quot;
                </Text>

                <Text className="text-black text-[14px] leading-[24px] mb-4">
                  Unfortunately, they are unable to accept your request at this time.
                </Text>

                {reason && (
                  <Text className="text-black text-[14px] leading-[24px] mb-4">
                    They provided the following reason:
                    <br />
                    <span className="italic">&quot;{reason}&quot;</span>
                  </Text>
                )}

                <Text className="text-black text-[14px] leading-[24px] mb-4">
                  Don&apos;t worry! There are many other opportunities available.
                  Keep exploring our platform to find other skill exchange offers
                  that match your interests.
                </Text>

                <Text className="text-black text-[14px] leading-[24px] mb-4">
                  <a
                    href={`${BASE_URL}/browse`}
                    target="_blank"
                    className="text-[#2754C5] underline"
                    rel="noreferrer"
                  >
                    Browse More Offers
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