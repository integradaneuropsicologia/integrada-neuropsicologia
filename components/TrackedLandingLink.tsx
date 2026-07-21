"use client";

import type { ReactNode } from "react";
import {
  type CtaLocation,
  trackGoogleReviewsClick,
  trackPhoneClick,
  trackWhatsAppClick,
} from "@/lib/data-layer";

type LinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  target?: "_blank";
  rel?: string;
};

export function TrackedWhatsAppLink({
  ctaLocation,
  ...props
}: LinkProps & { ctaLocation: CtaLocation }) {
  return (
    <a
      {...props}
      data-tracking-event="whatsapp_click"
      data-cta-location={ctaLocation}
      onClick={() => trackWhatsAppClick(ctaLocation)}
    />
  );
}

export function TrackedPhoneLink(props: LinkProps) {
  return (
    <a
      {...props}
      data-tracking-event="phone_click"
      data-cta-location="footer"
      onClick={trackPhoneClick}
    />
  );
}

export function TrackedGoogleReviewsLink(props: LinkProps) {
  return (
    <a
      {...props}
      data-tracking-event="google_reviews_click"
      data-cta-location="reviews_section"
      onClick={trackGoogleReviewsClick}
    />
  );
}
