import assert from "node:assert/strict";
import test from "node:test";

import {
  appendGoogleAdsClickReference,
  createLeadFormTrackingController,
  pushDataLayer,
  trackGoogleReviewsClick,
  trackPhoneClick,
  trackWhatsAppClick,
  updateGoogleConsent,
} from "../lib/data-layer.ts";

function installWindow() {
  const navigations = [];
  globalThis.window = {
    dataLayer: [],
    location: {
      assign(destination) {
        navigations.push(destination);
      },
    },
  };
  return { window: globalThis.window, navigations };
}

test.afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

test("emits only the allowlisted payload for each direct interaction", () => {
  const { window } = installWindow();

  trackWhatsAppClick("header");
  trackPhoneClick();
  trackGoogleReviewsClick();

  assert.deepEqual(window.dataLayer, [
    {
      event: "whatsapp_click",
      cta_location: "header",
      contact_method: "whatsapp",
      page_type: "landing_neuro_online",
    },
    {
      event: "phone_click",
      cta_location: "footer",
      contact_method: "phone",
      page_type: "landing_neuro_online",
    },
    {
      event: "google_reviews_click",
      cta_location: "reviews_section",
      destination: "google_maps",
      page_type: "landing_neuro_online",
    },
  ]);
});

test("drops unexpected runtime fields even when a JavaScript caller supplies them", () => {
  const { window } = installWindow();

  pushDataLayer("whatsapp_click", {
    cta_location: "hero",
    contact_method: "whatsapp",
    page_type: "landing_neuro_online",
    name: "NOME_SECRETO",
    interest: "AUTISMO",
    message: "MENSAGEM_SECRETA",
    link_url: "https://wa.me/segredo",
  });

  assert.deepEqual(window.dataLayer, [{
    event: "whatsapp_click",
    cta_location: "hero",
    contact_method: "whatsapp",
    page_type: "landing_neuro_online",
  }]);

  pushDataLayer("whatsapp_click", {
    cta_location: "NOME_SECRETO",
    contact_method: "whatsapp",
    page_type: "landing_neuro_online",
  });
  assert.equal(window.dataLayer.length, 1);
});

test("records form start once per form controller", () => {
  const { window } = installWindow();
  const hero = createLeadFormTrackingController("hero");
  const contact = createLeadFormTrackingController("contact_section");

  assert.equal(hero.start(), true);
  assert.equal(hero.start(), false);
  assert.equal(hero.start(), false);
  assert.equal(contact.start(), true);

  assert.deepEqual(window.dataLayer, [
    {
      event: "lead_form_start",
      form_location: "hero",
      page_type: "landing_neuro_online",
    },
    {
      event: "lead_form_start",
      form_location: "contact_section",
      page_type: "landing_neuro_online",
    },
  ]);
});

test("records a valid form submission once and redirects only after the event", () => {
  const { window } = installWindow();
  const scheduled = [];
  const navigations = [];
  const controller = createLeadFormTrackingController("hero", {
    navigate: (destination) => navigations.push(destination),
    schedule: (callback, delay) => scheduled.push({ callback, delay }),
  });
  const whatsappDestination = "https://wa.me/5541992113665?text=NOME_SECRETO%20AUTISMO%20MENSAGEM_SECRETA";

  assert.equal(controller.submit(whatsappDestination), true);
  assert.equal(controller.submit(whatsappDestination), false);
  assert.equal(window.dataLayer.length, 1);
  assert.equal(navigations.length, 0);

  const event = window.dataLayer[0];
  const { eventCallback, eventTimeout, ...safePayload } = event;
  assert.deepEqual(safePayload, {
    event: "lead_form_submit",
    form_location: "hero",
    contact_method: "whatsapp",
    page_type: "landing_neuro_online",
  });
  assert.equal(typeof eventCallback, "function");
  assert.equal(eventTimeout, 1000);
  assert.equal(scheduled.length, 1);
  assert.equal(scheduled[0].delay, 1200);

  eventCallback();
  scheduled[0].callback();
  assert.deepEqual(navigations, [whatsappDestination]);

  const serializedEvents = JSON.stringify(window.dataLayer);
  assert.doesNotMatch(serializedEvents, /NOME_SECRETO|AUTISMO|MENSAGEM_SECRETA|wa\.me/i);
  for (const forbiddenKey of ["name", "interest", "message", "link_url", "phone", "whatsapp_url"]) {
    assert.equal(Object.hasOwn(event, forbiddenKey), false);
  }
});

test("keeps direct WhatsApp clicks and form submissions as separate events", () => {
  const { window } = installWindow();
  const scheduled = [];
  const controller = createLeadFormTrackingController("contact_section", {
    navigate: () => {},
    schedule: (callback) => scheduled.push(callback),
  });

  trackWhatsAppClick("contact");
  controller.submit("https://wa.me/example");

  assert.deepEqual(window.dataLayer.map((entry) => entry.event), [
    "whatsapp_click",
    "lead_form_submit",
  ]);
  assert.equal(scheduled.length, 1);
});

test("adds consented GCLID, GBRAID or WBRAID only to the WhatsApp draft", () => {
  for (const [parameter, label] of [
    ["gclid", "GCLID"],
    ["gbraid", "GBRAID"],
    ["wbraid", "WBRAID"],
  ]) {
    const { window } = installWindow();
    window.location.href = `https://integradaneuropsicologia.com.br/avaliacao-neuropsicologica-online-adultos?${parameter}=AbC_123-test`;
    window.localStorage = {
      getItem(key) {
        if (key !== "integrada-cookie-consent-v1") return null;
        return JSON.stringify({
          version: 1,
          ads: true,
          expiresAt: Date.now() + 60_000,
        });
      },
    };

    const destination = appendGoogleAdsClickReference("https://wa.me/5541992113665?text=Ol%C3%A1");
    const parsed = new URL(destination);

    assert.equal(parsed.searchParams.get("text"), `Olá\nReferência do anúncio: ${label}=AbC_123-test`);
    assert.deepEqual(window.dataLayer, []);
  }
});

test("does not append an ad reference without advertising consent", () => {
  const { window } = installWindow();
  window.location.href = "https://integradaneuropsicologia.com.br/avaliacao-neuropsicologica-online-adultos?gclid=AbC_123-test";
  window.localStorage = { getItem: () => null };
  const original = "https://wa.me/5541992113665?text=Ol%C3%A1";

  assert.equal(appendGoogleAdsClickReference(original), original);
});

test("does not append an ad reference after advertising consent expires", () => {
  const { window } = installWindow();
  window.location.href = "https://integradaneuropsicologia.com.br/avaliacao-neuropsicologica-online-adultos?wbraid=AbC_123-test";
  window.localStorage = {
    getItem: () => JSON.stringify({
      version: 1,
      ads: true,
      expiresAt: Date.now() - 1,
    }),
  };
  const original = "https://wa.me/5541992113665?text=Ol%C3%A1";

  assert.equal(appendGoogleAdsClickReference(original), original);
});

test("the fallback and GTM callback share the same redirect guard", () => {
  const { window } = installWindow();
  const scheduled = [];
  const navigations = [];
  const controller = createLeadFormTrackingController("contact_section", {
    navigate: (destination) => navigations.push(destination),
    schedule: (callback) => scheduled.push(callback),
  });

  controller.submit("https://wa.me/example");
  scheduled[0]();
  window.dataLayer[0].eventCallback();

  assert.deepEqual(navigations, ["https://wa.me/example"]);
});

test("queues a single Consent Mode v2 update with personalization denied", () => {
  const { window } = installWindow();

  updateGoogleConsent({ analytics: true, ads: true });

  assert.equal(window.dataLayer.length, 1);
  assert.deepEqual(Array.from(window.dataLayer[0]), [
    "consent",
    "update",
    {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "denied",
    },
  ]);
});
