/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useId, useState } from "react";
import { updateGoogleConsent } from "@/lib/data-layer";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  COOKIE_PREFERENCE_LIFETIME_MS,
} from "@/lib/consent-config";

type ConsentPreference = {
  version: 1;
  analytics: boolean;
  ads: boolean;
  decidedAt: string;
  expiresAt: number;
};

function removeOptionalCookies(preference: Pick<ConsentPreference, "analytics" | "ads">) {
  const analyticsCookie = /^(?:_ga|_gid|_gat)/;
  const advertisingCookie = /^(?:_gcl_|_fbp)/;
  const hostname = window.location.hostname;
  const domainCandidates = [hostname, `.${hostname}`];

  for (const item of document.cookie.split(";")) {
    const name = item.split("=")[0]?.trim();
    if (!name) continue;
    const shouldRemove = (!preference.analytics && analyticsCookie.test(name)) || (!preference.ads && advertisingCookie.test(name));
    if (!shouldRemove) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    for (const domain of domainCandidates) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
    }
  }
}

function applyConsent(preference: Pick<ConsentPreference, "analytics" | "ads">) {
  updateGoogleConsent(preference);

  if (!preference.analytics || !preference.ads) removeOptionalCookies(preference);
}

function readStoredPreference(): ConsentPreference | null {
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<ConsentPreference>;
    if (value.version !== COOKIE_CONSENT_VERSION || typeof value.analytics !== "boolean" || typeof value.ads !== "boolean" || typeof value.expiresAt !== "number") return null;
    if (value.expiresAt <= Date.now()) {
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      return null;
    }
    return value as ConsentPreference;
  } catch {
    return null;
  }
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("integrada:open-cookie-preferences"))}
    >
      Preferências de cookies
    </button>
  );
}

export function CookieConsent() {
  const analyticsId = useId();
  const adsId = useId();
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const preference = readStoredPreference();
    if (preference) {
      applyConsent(preference);
    }
    const initializeUi = window.setTimeout(() => {
      setAnalytics(preference?.analytics ?? false);
      setAds(preference?.ads ?? false);
      setOpen(!preference);
    }, 0);

    const openPreferences = () => {
      const current = readStoredPreference();
      setAnalytics(current?.analytics ?? false);
      setAds(current?.ads ?? false);
      setCustomizing(true);
      setOpen(true);
    };
    window.addEventListener("integrada:open-cookie-preferences", openPreferences);
    return () => {
      window.clearTimeout(initializeUi);
      window.removeEventListener("integrada:open-cookie-preferences", openPreferences);
    };
  }, []);

  function savePreference(nextAnalytics: boolean, nextAds: boolean) {
    const preference: ConsentPreference = {
      version: COOKIE_CONSENT_VERSION,
      analytics: nextAnalytics,
      ads: nextAds,
      decidedAt: new Date().toISOString(),
      expiresAt: Date.now() + COOKIE_PREFERENCE_LIFETIME_MS,
    };
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(preference));
    } catch {
      // The choice still applies to the current page when browser storage is unavailable.
    }
    applyConsent(preference);
    setAnalytics(nextAnalytics);
    setAds(nextAds);
    setCustomizing(false);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <section className="cookie-consent" role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title">
      <div className="cookie-consent-copy">
        <span>Privacidade</span>
        <h2 id="cookie-consent-title">Você escolhe como a navegação pode ser medida.</h2>
        <p>Usamos armazenamento necessário para lembrar sua escolha. Cookies de medição ou publicidade só podem ser ativados com a sua autorização. Leia a <a href="/politica-de-privacidade">Política de Privacidade</a>.</p>
      </div>

      {customizing && (
        <div className="cookie-options">
          <label htmlFor={analyticsId}>
            <input id={analyticsId} type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            <span><strong>Medição de audiência</strong><small>Ajuda a entender visitas e desempenho sem usar o conteúdo digitado no formulário.</small></span>
          </label>
          <label htmlFor={adsId}>
            <input id={adsId} type="checkbox" checked={ads} onChange={(event) => setAds(event.target.checked)} />
            <span><strong>Publicidade e conversões</strong><small>Permite medir campanhas e, em visitas de anúncio, incluir uma referência técnica no rascunho do WhatsApp. Nenhum nome, telefone ou conteúdo clínico é enviado ao Google nessa qualificação.</small></span>
          </label>
        </div>
      )}

      <div className="cookie-consent-actions">
        {customizing ? (
          <button type="button" className="cookie-button cookie-button-primary" onClick={() => savePreference(analytics, ads)}>Salvar preferências</button>
        ) : (
          <button type="button" className="cookie-button cookie-button-outline" onClick={() => setCustomizing(true)}>Personalizar</button>
        )}
        <button type="button" className="cookie-button cookie-button-quiet" onClick={() => savePreference(false, false)}>Rejeitar não necessários</button>
        <button type="button" className="cookie-button cookie-button-primary" onClick={() => savePreference(true, true)}>Aceitar todos</button>
      </div>
    </section>
  );
}
