"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  appendGoogleAdsClickReference,
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
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackWhatsAppClick(ctaLocation);
    event.currentTarget.href = appendGoogleAdsClickReference(props.href);
  }

  return (
    <a
      {...props}
      data-tracking-event="whatsapp_click"
      data-cta-location={ctaLocation}
      onClick={handleClick}
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
