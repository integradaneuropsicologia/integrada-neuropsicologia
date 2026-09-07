import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from "./consent-config.ts";

export const LANDING_PAGE_TYPE = "landing_neuro_online" as const;

const GOOGLE_AD_CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;
const GOOGLE_AD_CLICK_ID_PATTERN = /^[A-Za-z0-9._~-]{6,512}$/;
const GOOGLE_AD_CLICK_STORAGE_KEY = "integrada-google-ads-click-v1";
const GOOGLE_AD_CLICK_STORAGE_VERSION = 1;
const GOOGLE_AD_CLICK_LIFETIME_MS = 1000 * 60 * 60 * 2;
let googleAdClickExpiryTimer: number | null = null;

export type CtaLocation =
  | "header"
  | "hero"
  | "signals"
  | "professional"
  | "contact"
  | "final"
  | "floating_mobile";

export type FormLocation = "hero" | "contact_section";

const ALLOWED_CTA_LOCATIONS = new Set<CtaLocation>([
  "header",
  "hero",
  "signals",
  "professional",
  "contact",
  "final",
  "floating_mobile",
]);
const ALLOWED_FORM_LOCATIONS = new Set<FormLocation>(["hero", "contact_section"]);

type LandingEventParameters = {
  whatsapp_click: {
    cta_location: CtaLocation;
    contact_method: "whatsapp";
    page_type: typeof LANDING_PAGE_TYPE;
  };
  lead_form_start: {
    form_location: FormLocation;
    page_type: typeof LANDING_PAGE_TYPE;
  };
  lead_form_submit: {
    form_location: FormLocation;
    contact_method: "whatsapp";
    page_type: typeof LANDING_PAGE_TYPE;
  };
  phone_click: {
    cta_location: "footer";
    contact_method: "phone";
    page_type: typeof LANDING_PAGE_TYPE;
  };
  google_reviews_click: {
    cta_location: "reviews_section";
    destination: "google_maps";
    page_type: typeof LANDING_PAGE_TYPE;
  };
};

type LandingEventName = keyof LandingEventParameters;

type EventTransport = {
  eventCallback?: () => void;
  eventTimeout?: number;
};

type ConsentPreference = {
  analytics: boolean;
  ads: boolean;
};

type GoogleAdClickIdKey = (typeof GOOGLE_AD_CLICK_ID_KEYS)[number];

type StoredGoogleAdClickReference = {
  version: 1;
  key: GoogleAdClickIdKey;
  value: string;
  expiresAt: number;
};

type RedirectDependencies = {
  navigate?: (destination: string) => void;
  schedule?: (callback: () => void, delay: number) => unknown;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function dataLayer() {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/**
 * The only generic entry point for landing-page interaction events.
 * Its event map intentionally exposes no free-form or health-related fields.
 */
export function pushDataLayer<EventName extends LandingEventName>(
  eventName: EventName,
  parameters: LandingEventParameters[EventName],
  transport: EventTransport = {},
) {
  let safeEvent: Record<string, unknown>;

  switch (eventName) {
    case "whatsapp_click": {
      const values = parameters as LandingEventParameters["whatsapp_click"];
      if (!ALLOWED_CTA_LOCATIONS.has(values.cta_location)) return;
      safeEvent = {
        event: "whatsapp_click",
        cta_location: values.cta_location,
        contact_method: "whatsapp",
        page_type: LANDING_PAGE_TYPE,
      };
      break;
    }
    case "lead_form_start": {
      const values = parameters as LandingEventParameters["lead_form_start"];
      if (!ALLOWED_FORM_LOCATIONS.has(values.form_location)) return;
      safeEvent = {
        event: "lead_form_start",
        form_location: values.form_location,
        page_type: LANDING_PAGE_TYPE,
      };
      break;
    }
    case "lead_form_submit": {
      const values = parameters as LandingEventParameters["lead_form_submit"];
      if (!ALLOWED_FORM_LOCATIONS.has(values.form_location)) return;
      safeEvent = {
        event: "lead_form_submit",
        form_location: values.form_location,
        contact_method: "whatsapp",
        page_type: LANDING_PAGE_TYPE,
      };
      if (typeof transport.eventCallback === "function") safeEvent.eventCallback = transport.eventCallback;
      if (typeof transport.eventTimeout === "number" && Number.isFinite(transport.eventTimeout)) safeEvent.eventTimeout = transport.eventTimeout;
      break;
    }
    case "phone_click":
      safeEvent = {
        event: "phone_click",
        cta_location: "footer",
        contact_method: "phone",
        page_type: LANDING_PAGE_TYPE,
      };
      break;
    case "google_reviews_click":
      safeEvent = {
        event: "google_reviews_click",
        cta_location: "reviews_section",
        destination: "google_maps",
        page_type: LANDING_PAGE_TYPE,
      };
      break;
    default:
      return;
  }

  dataLayer().push(safeEvent);
}

function queuedGtagCommand() {
  // Google Consent Mode expects the Arguments object queued by the standard
  // gtag command interface. This does not load gtag.js.
  // eslint-disable-next-line prefer-rest-params
  dataLayer().push(arguments);
}

export function updateGoogleConsent(preference: ConsentPreference) {
  window.gtag = window.gtag || queuedGtagCommand;
  window.gtag("consent", "update", {
    analytics_storage: preference.analytics ? "granted" : "denied",
    ad_storage: preference.ads ? "granted" : "denied",
    ad_user_data: preference.ads ? "granted" : "denied",
    ad_personalization: "denied",
  });
}

export function trackWhatsAppClick(ctaLocation: CtaLocation) {
  pushDataLayer("whatsapp_click", {
    cta_location: ctaLocation,
    contact_method: "whatsapp",
    page_type: LANDING_PAGE_TYPE,
  });
}

export function trackPhoneClick() {
  pushDataLayer("phone_click", {
    cta_location: "footer",
    contact_method: "phone",
    page_type: LANDING_PAGE_TYPE,
  });
}

export function trackGoogleReviewsClick() {
  pushDataLayer("google_reviews_click", {
    cta_location: "reviews_section",
    destination: "google_maps",
    page_type: LANDING_PAGE_TYPE,
  });
}

function hasAdsMeasurementConsent() {
  try {
    const raw = window.localStorage?.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const consent = JSON.parse(raw) as {
      version?: number;
      ads?: boolean;
      expiresAt?: number;
    };
    return consent.version === COOKIE_CONSENT_VERSION && consent.ads === true &&
      typeof consent.expiresAt === "number" && consent.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function currentGoogleAdClickReference(): Pick<StoredGoogleAdClickReference, "key" | "value"> | null {
  try {
    const currentHref = typeof window.location?.href === "string" ? window.location.href : "";
    if (!currentHref) return null;

    const currentUrl = new URL(currentHref);
    for (const key of GOOGLE_AD_CLICK_ID_KEYS) {
      const value = currentUrl.searchParams.get(key)?.trim() ?? "";
      if (GOOGLE_AD_CLICK_ID_PATTERN.test(value)) return { key, value };
    }

    return null;
  } catch {
    return null;
  }
}

function clearGoogleAdsClickExpiryTimer() {
  if (googleAdClickExpiryTimer === null) return;
  if (typeof window.clearTimeout === "function") window.clearTimeout(googleAdClickExpiryTimer);
  googleAdClickExpiryTimer = null;
}

function scheduleGoogleAdsClickExpiry(expiresAt: number) {
  clearGoogleAdsClickExpiryTimer();
  if (typeof window.setTimeout !== "function") return;

  const delay = Math.max(0, Math.min(expiresAt - Date.now(), GOOGLE_AD_CLICK_LIFETIME_MS));
  googleAdClickExpiryTimer = window.setTimeout(() => {
    googleAdClickExpiryTimer = null;
    try {
      window.sessionStorage?.removeItem(GOOGLE_AD_CLICK_STORAGE_KEY);
    } catch {
      // The reference remains unusable because every read still validates expiry.
    }
  }, delay);
}

function removeStoredGoogleAdClickReference() {
  try {
    window.sessionStorage?.removeItem(GOOGLE_AD_CLICK_STORAGE_KEY);
  } catch {
    // Keep the privacy-safe no-reference behavior when storage is unavailable.
  }
}

function storedGoogleAdClickReference(): Pick<StoredGoogleAdClickReference, "key" | "value"> | null {
  try {
    const raw = window.sessionStorage?.getItem(GOOGLE_AD_CLICK_STORAGE_KEY);
    if (!raw) return null;

    const value = JSON.parse(raw) as Partial<StoredGoogleAdClickReference>;
    const exactKeys = Object.keys(value).sort().join(",") === "expiresAt,key,value,version";
    const validKey = GOOGLE_AD_CLICK_ID_KEYS.includes(value.key as GoogleAdClickIdKey);
    const validValue = typeof value.value === "string" && GOOGLE_AD_CLICK_ID_PATTERN.test(value.value);
    const validExpiry = typeof value.expiresAt === "number" &&
      value.expiresAt > Date.now() &&
      value.expiresAt <= Date.now() + GOOGLE_AD_CLICK_LIFETIME_MS;

    if (!exactKeys || value.version !== GOOGLE_AD_CLICK_STORAGE_VERSION || !validKey || !validValue || !validExpiry) {
      removeStoredGoogleAdClickReference();
      return null;
    }

    scheduleGoogleAdsClickExpiry(value.expiresAt as number);
    return { key: value.key as GoogleAdClickIdKey, value: value.value as string };
  } catch {
    removeStoredGoogleAdClickReference();
    return null;
  }
}

export function clearGoogleAdsClickReference() {
  if (typeof window === "undefined") return;
  clearGoogleAdsClickExpiryTimer();
  removeStoredGoogleAdClickReference();
}

/**
 * Keeps only a validated ad-click identifier in this browser tab for up to two
 * hours. No URL, form content, name, phone number or clinical detail is stored.
 */
export function captureGoogleAdsClickReference() {
  if (typeof window === "undefined" || !hasAdsMeasurementConsent()) {
    clearGoogleAdsClickReference();
    return null;
  }

  const currentReference = currentGoogleAdClickReference();
  if (!currentReference) return storedGoogleAdClickReference();

  const stored: StoredGoogleAdClickReference = {
    version: GOOGLE_AD_CLICK_STORAGE_VERSION,
    ...currentReference,
    expiresAt: Date.now() + GOOGLE_AD_CLICK_LIFETIME_MS,
  };

  try {
    window.sessionStorage?.setItem(GOOGLE_AD_CLICK_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // The current URL can still be used when session storage is unavailable.
  }
  scheduleGoogleAdsClickExpiry(stored.expiresAt);

  return currentReference;
}

/**
 * Adds only the Google Ads click identifier to the WhatsApp draft when the
 * visitor has granted advertising consent. The identifier never enters the
 * dataLayer and no name, health information or message content is sent to
 * Google. It lets the team later import a qualified-lead conversion using the
 * WhatsApp message timestamp.
 */
export function appendGoogleAdsClickReference(whatsappDestination: string) {
  if (typeof window === "undefined") return whatsappDestination;

  const clickReference = captureGoogleAdsClickReference();
  if (!clickReference) return whatsappDestination;

  try {
    const destination = new URL(whatsappDestination);
    const currentText = destination.searchParams.get("text") ?? "";
    const reference = "Referência do anúncio: " + clickReference.key.toUpperCase() + "=" + clickReference.value;
    if (currentText.includes(reference)) return whatsappDestination;

    destination.searchParams.set("text", [currentText, reference].filter(Boolean).join("\n"));
    return destination.toString();
  } catch {
    return whatsappDestination;
  }
}

function trackAndOpenWhatsApp(
  whatsappDestination: string,
  formLocation: FormLocation,
  dependencies: RedirectDependencies = {},
) {
  let redirected = false;
  const navigate = dependencies.navigate ?? ((destination: string) => window.location.assign(destination));
  const schedule = dependencies.schedule ?? ((callback: () => void, delay: number) => window.setTimeout(callback, delay));

  const redirect = () => {
    if (redirected) return;
    redirected = true;
    navigate(whatsappDestination);
  };

  pushDataLayer(
    "lead_form_submit",
    {
      form_location: formLocation,
      contact_method: "whatsapp",
      page_type: LANDING_PAGE_TYPE,
    },
    {
      eventCallback: redirect,
      eventTimeout: 1000,
    },
  );

  schedule(redirect, 1200);
}

export function createLeadFormTrackingController(
  formLocation: FormLocation,
  dependencies: RedirectDependencies = {},
) {
  let started = false;
  let submitting = false;
  let conversionRecorded = false;
  const navigate = dependencies.navigate ?? ((destination: string) => window.location.assign(destination));

  return {
    start() {
      if (started) return false;
      started = true;
      pushDataLayer("lead_form_start", {
        form_location: formLocation,
        page_type: LANDING_PAGE_TYPE,
      });
      return true;
    },
    submit(whatsappDestination: string) {
      if (submitting) return false;
      submitting = true;
      if (conversionRecorded) {
        navigate(whatsappDestination);
        return true;
      }
      conversionRecorded = true;
      trackAndOpenWhatsApp(whatsappDestination, formLocation, dependencies);
      return true;
    },
    resetSubmission() {
      submitting = false;
    },
  };
}
