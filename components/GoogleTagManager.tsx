/* eslint-disable @next/next/next-script-for-ga -- The specification requires the official GTM head and noscript snippets, conditionally rendered from a validated real container ID. */

import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from "@/lib/consent-config";

const GTM_CONTAINER_PATTERN = /^GTM-[A-Z0-9]+$/;

export function resolveGtmContainerId(value: string | undefined) {
  const containerId = value?.trim().toUpperCase();
  return containerId && GTM_CONTAINER_PATTERN.test(containerId) ? containerId : null;
}

export function GoogleConsentDefaults() {
  const storageKey = JSON.stringify(COOKIE_CONSENT_STORAGE_KEY);

  return (
    <script
      data-google-consent-defaults="true"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
          window.gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          try {
            var storedConsent = JSON.parse(window.localStorage.getItem(${storageKey}) || 'null');
            if (
              storedConsent &&
              storedConsent.version === ${COOKIE_CONSENT_VERSION} &&
              typeof storedConsent.analytics === 'boolean' &&
              typeof storedConsent.ads === 'boolean' &&
              typeof storedConsent.expiresAt === 'number' &&
              storedConsent.expiresAt > Date.now()
            ) {
              window.gtag('consent', 'update', {
                analytics_storage: storedConsent.analytics ? 'granted' : 'denied',
                ad_storage: storedConsent.ads ? 'granted' : 'denied',
                ad_user_data: storedConsent.ads ? 'granted' : 'denied',
                ad_personalization: 'denied'
              });
            }
          } catch (_) {
            // Keep the privacy-safe denied defaults when storage is unavailable or invalid.
          }
        `,
      }}
    />
  );
}

export function GoogleTagManagerHead({ containerId }: { containerId: string | null }) {
  if (!containerId) return null;

  return (
    <script
      data-google-tag-manager="head"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer',${JSON.stringify(containerId)});
        `,
      }}
    />
  );
}

export function GoogleTagManagerNoScript({ containerId }: { containerId: string | null }) {
  if (!containerId) return null;

  return (
    <noscript data-google-tag-manager="body">
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(containerId)}`}
        height="0"
        width="0"
        title="Google Tag Manager"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
