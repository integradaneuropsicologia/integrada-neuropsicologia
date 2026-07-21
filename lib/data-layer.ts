export const LANDING_PAGE_TYPE = "landing_neuro_online" as const;

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
      trackAndOpenWhatsApp(whatsappDestination, formLocation, dependencies);
      return true;
    },
  };
}
