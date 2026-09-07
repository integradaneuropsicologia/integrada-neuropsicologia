import assert from "node:assert/strict";
import test from "node:test";

import { normalizeTrackingRequestForRender } from "../lib/request-normalization.ts";
import {
  STATIC_HTML_PAGE_PATHS,
  staticHtmlAssetPath,
  staticHtmlAssetRequestPath,
} from "../lib/static-html.ts";

const landingPath = "/avaliacao-neuropsicologica-online-adultos";

async function render(pathname = "/", hostname = "localhost") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${hostname}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${hostname}${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function renderWithAssets(
  pathname,
  assetsFetch,
  hostname = "integradaneuropsicologia.com.br",
  requestInit = {},
) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test-assets", `${process.pid}-${Date.now()}-${hostname}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${hostname}${pathname}`, {
      ...requestInit,
      headers: { accept: "text/html", ...requestInit.headers },
    }),
    { ASSETS: { fetch: assetsFetch } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the adult online assessment landing page", async () => {
  const response = await render(landingPath);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Avaliação Neuropsicológica Online para Adultos \| Integrada<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/integradaneuropsicologia\.com\.br\/avaliacao-neuropsicologica-online-adultos"/i);
  assert.match(html, /name="description" content="Avaliação neuropsicológica 100% online para brasileiros com 18 anos ou mais/i);
  assert.match(html, /name="google-site-verification" content="WQqzIuO-fBHkrlX9jhelg58ubDCZEmVNLFnbivLY9os"/i);
  assert.match(html, /Avaliação neuropsicológica[^<]*<em>100% on-line para adultos/i);
  assert.match(html, /Entenda o que está por trás/);
  assert.match(html, /foco, memória, organização e relacionamento/i);
  assert.match(html, /Quero conversar com a equipe/);
  assert.match(html, /Brasileiros com 18 anos ou mais/i);
  assert.match(html, /Quero conversar sobre a avaliação/);
  assert.match(html, /brasileiros no Brasil e em outros países/i);
  assert.match(html, /Mais de 15 anos/);
  assert.match(html, /Conteúdo editorial atualizado em agosto de 2026/i);
  assert.match(html, /Consulte as experiências compartilhadas diretamente no Google/i);
  assert.match(html, /https:\/\/maps\.app\.goo\.gl\/UTfmE9ovaxSuGaCc9/);
  assert.match(html, /não reproduzimos relatos individuais neste site/i);
  assert.match(html, /Carla Luciana da Conceição Lima/);
  assert.match(html, /CRP 08\/39739/);
  assert.match(html, /src="\/assets\/hero-online\.webp"/);
  const heroPreloads = (html.match(/<link\b[^>]*rel="preload"[^>]*>/gi) ?? [])
    .filter((tag) => /href="\/assets\/hero-online\.webp"/i.test(tag));
  assert.equal(heroPreloads.length, 0, "the below-fold mobile hero image should not compete with critical text");
  assert.match(html, /src="\/assets\/hero-online\.webp"[^>]+loading="lazy"[^>]+decoding="async"/i);
  assert.doesNotMatch(html, /src="\/assets\/hero-online\.webp"[^>]+fetchPriority="high"/i);
  assert.match(html, /Autorizo o tratamento do meu nome e das informações que eu escolher informar/i);
  assert.match(html, /não são armazenados neste site/i);
  assert.match(html, /Como funciona a medição de campanhas/i);
  assert.match(html, /uma referência técnica do clique pode ser mantida temporariamente nesta aba/i);
  assert.match(html, /nenhum nome, telefone, mensagem ou dado de saúde é enviado ao Google/i);
  assert.match(html, /href="\/politica-de-privacidade"/i);
  assert.match(html, /analytics_storage:\s*'denied'/i);
  assert.match(html, /ad_storage:\s*'denied'/i);
  assert.match(html, /ad_user_data:\s*'denied'/i);
  assert.match(html, /ad_personalization:\s*'denied'/i);
  assert.match(html, /wait_for_update:\s*500/i);
  assert.match(html, /localStorage\.getItem\("integrada-cookie-consent-v1"\)/i);
  assert.match(html, /storedConsent\.expiresAt\s*>\s*Date\.now\(\)/i);
  assert.match(html, /data-integrada-cookie-consent['"],\s*['"]stored/i);
  assert.match(html, /analytics_storage:\s*storedConsent\.analytics\s*\?\s*'granted'\s*:\s*'denied'/i);
  assert.match(html, /ad_storage:\s*storedConsent\.ads\s*\?\s*'granted'\s*:\s*'denied'/i);
  assert.match(html, /ad_user_data:\s*storedConsent\.ads\s*\?\s*'granted'\s*:\s*'denied'/i);
  assert.equal((html.match(/data-tracking-event="whatsapp_click"/g) ?? []).length, 7);
  assert.equal((html.match(/data-tracking-event="phone_click"/g) ?? []).length, 1);
  assert.equal((html.match(/data-tracking-event="google_reviews_click"/g) ?? []).length, 1);
  assert.equal((html.match(/data-form-location="hero"/g) ?? []).length, 1);
  assert.equal((html.match(/data-form-location="contact_section"/g) ?? []).length, 1);
  assert.match(html, /"@type":"LocalBusiness"/);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /"requiredMinAge":18/);
  assert.match(html, /"url":"https:\/\/integradaneuropsicologia\.com\.br\/avaliacao-neuropsicologica-online-adultos"/i);
  assert.match(html, /href="https:\/\/www\.integradaneuropsicologia\.com\.br\/avaliacaotdah"/i);
  assert.match(html, /href="https:\/\/www\.integradaneuropsicologia\.com\.br\/avaliacaoautismo"/i);
  assert.doesNotMatch(html, /aggregateRating|"@type":"Review"|"@type":"FAQPage"/);
  assert.doesNotMatch(html, /src="\/assets\/hero-family\.avif"/);
  assert.doesNotMatch(html, /Nada fica armazenado neste site/i);
  assert.doesNotMatch(html, /googletagmanager\.com\/gtag\/js|google-analytics\.com/i);
  assert.doesNotMatch(html, /G-KN0F1TETG2|GT-NCN22HRP|gtag\(['"]config['"]/i);
  const consentDefaultsIndex = html.indexOf('data-google-consent-defaults="true"');
  const consentDefaultCommandIndex = html.indexOf("window.gtag('consent', 'default'");
  const storedConsentUpdateIndex = html.indexOf("window.gtag('consent', 'update'");
  const gtmHeadIndex = html.indexOf('data-google-tag-manager="head"');
  assert.ok(consentDefaultsIndex >= 0, "Consent Mode defaults should exist");
  assert.ok(consentDefaultCommandIndex > consentDefaultsIndex, "Consent Mode should deny by default");
  assert.ok(storedConsentUpdateIndex > consentDefaultCommandIndex, "Stored consent should be restored only after privacy-safe defaults");
  assert.ok(gtmHeadIndex > consentDefaultsIndex, "Consent Mode defaults should precede the GTM loader");
  assert.ok(gtmHeadIndex > storedConsentUpdateIndex, "Stored consent should be restored before the GTM loader");
  assert.match(html, /<body[^>]*><noscript data-google-tag-manager="body">/i);
  assert.equal((html.match(/data-google-tag-manager="head"/g) ?? []).length, 1);
  assert.equal((html.match(/data-google-tag-manager="body"/g) ?? []).length, 1);
  assert.match(html, /Você escolhe como a navegação pode ser medida/i);
  const gtmHeadMarkup = html.match(/<script data-google-tag-manager="head">[\s\S]*?<\/script>/i)?.[0] ?? "";
  const gtmBodyMarkup = html.match(/<noscript data-google-tag-manager="body">[\s\S]*?<\/noscript>/i)?.[0] ?? "";
  assert.equal((gtmHeadMarkup.match(/googletagmanager\.com\/gtm\.js\?id=/g) ?? []).length, 1);
  assert.equal((gtmBodyMarkup.match(/googletagmanager\.com\/ns\.html\?id=/g) ?? []).length, 1);
  assert.equal((gtmHeadMarkup.match(/GTM-KHPMDWM9/g) ?? []).length, 1);
  assert.equal((gtmBodyMarkup.match(/GTM-KHPMDWM9/g) ?? []).length, 1);
  assert.match(gtmHeadMarkup, /integradaLoadGtm=load/i);
  assert.match(gtmHeadMarkup, /setTimeout\(load,2500\)/i);
  assert.match(gtmHeadMarkup, /addEventListener\('pointerdown',load/i);
  assert.match(gtmHeadMarkup, /addEventListener\('touchstart',load/i);
  assert.match(gtmHeadMarkup, /addEventListener\('keydown',load/i);
  assert.match(gtmHeadMarkup, /gtm_\(\?:debug\|preview\|auth\)/i);
  assert.ok(gtmHeadMarkup.indexOf("function load()") < gtmHeadMarkup.indexOf("googletagmanager.com/gtm.js"));
  assert.doesNotMatch(html, /chatgpt\.site/i);
  assert.doesNotMatch(html, /triagem|Origem:|14\+? anos/i);
  assert.doesNotMatch(html, /\/_vinext\/image/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("publishes crawl directives and a canonical XML sitemap", async () => {
  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, /Sitemap:\s*https:\/\/integradaneuropsicologia\.com\.br\/sitemap\.xml/i);

  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/integradaneuropsicologia\.com\.br\/avaliacao-neuropsicologica-online-adultos<\/loc>/i);
  assert.match(sitemap, /\/avaliacao-neuropsicologica-online-adultos\/como-funciona<\/loc>/i);
  assert.match(sitemap, /\/avaliacao-neuropsicologica-online-adultos\/para-quem<\/loc>/i);
  assert.match(sitemap, /\/avaliacao-neuropsicologica-online-adultos\/o-que-investiga<\/loc>/i);
  assert.match(sitemap, /\/avaliacao-neuropsicologica-online-adultos\/duvidas<\/loc>/i);
  assert.match(sitemap, /\/avaliacao-neuropsicologica-online-adultos\/avaliacoes<\/loc>/i);
  assert.match(sitemap, /\/avaliacao-neuropsicologica-online-adultos\/contato<\/loc>/i);
  assert.match(sitemap, /\/politica-de-privacidade<\/loc>/i);
  assert.doesNotMatch(sitemap, /\/avaliacaotdah<\/loc>|\/post\/|\/jogosdeestimula/i);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 8);
});

test("server-renders distinct landing destinations for Google Ads sitelinks", async () => {
  const destinations = [
    ["como-funciona", /Como funciona a .* on-line/i],
    ["para-quem", /Para quem .* on-line/i],
    ["o-que-investiga", /O que a .* pode investigar/i],
    ["duvidas", /Todo o processo acontece on-line/i],
    ["avaliacoes", /publicadas no Google/i],
    ["contato", /Converse com a equipe sobre a/i],
  ];

  for (const [slug, expectedHeading] of destinations) {
    const response = await render(`${landingPath}/${slug}`, "integradaneuropsicologia.com.br");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    const html = await response.text();
    assert.match(html, expectedHeading);
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="https:\\/\\/integradaneuropsicologia\\.com\\.br${landingPath}\\/${slug}"`, "i"),
    );
    assert.match(html, /data-tracking-event="whatsapp_click"/i);
  }
});

test("publishes a complete privacy policy for form and cookie data", async () => {
  const response = await render("/politica-de-privacidade");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Política de Privacidade \| Integrada Neuropsicologia<\/title>/i);
  assert.match(html, /Os dados preenchidos apenas preparam a mensagem/i);
  assert.match(html, /WhatsApp\/Meta/i);
  assert.match(html, /Medição de audiência/i);
  assert.match(html, /Publicidade e conversões/i);
  assert.match(html, /GCLID/);
  assert.match(html, /GBRAID/);
  assert.match(html, /WBRAID/);
  assert.match(html, /Google Ads Data Manager/i);
  assert.match(html, /não recebe nome, telefone, e-mail, mensagem do WhatsApp, queixa, hipótese diagnóstica ou outro dado clínico/i);
  assert.match(html, /Última atualização: 7 de setembro de 2026/i);
  assert.match(html, /válida para uso por no máximo duas horas/i);
  assert.doesNotMatch(html, /hospedada no Wix/i);
  assert.match(html, /Carla Luciana da Conceição Lima/i);
  assert.match(html, /Preferências de cookies/i);
  assert.match(html, /href="\/avaliacao-neuropsicologica-online-adultos"/i);
});

test("routes only the custom apex landing and privacy pages to Sites", async () => {
  const apex = "integradaneuropsicologia.com.br";

  const rootResponse = await render("/", apex);
  assert.equal(rootResponse.status, 308);
  assert.equal(rootResponse.headers.get("location"), "https://www.integradaneuropsicologia.com.br/");

  const legacyResponse = await render("/avaliacaotdah?utm_source=teste", apex);
  assert.equal(legacyResponse.status, 308);
  assert.equal(
    legacyResponse.headers.get("location"),
    "https://www.integradaneuropsicologia.com.br/avaliacaotdah?utm_source=teste",
  );

  const unicodeResponse = await render("/post/avalia%C3%A7%C3%A3o?gclid=abc123", apex);
  assert.equal(unicodeResponse.status, 308);
  assert.equal(
    unicodeResponse.headers.get("location"),
    "https://www.integradaneuropsicologia.com.br/post/avalia%C3%A7%C3%A3o?gclid=abc123",
  );

  const landingResponse = await render(`${landingPath}?utm_source=google`, apex);
  assert.equal(landingResponse.status, 200);
  assert.match(landingResponse.headers.get("cache-control") ?? "", /s-maxage=86400/i);

  const landingRscResponse = await render(`${landingPath}.rsc`, apex);
  assert.equal(landingRscResponse.status, 200);
  assert.equal(landingRscResponse.headers.get("location"), null);
  assert.match(landingRscResponse.headers.get("content-type") ?? "", /^text\/x-component\b/i);

  const trackedLandingRscResponse = await render(`${landingPath}.rsc?gclid=Click123`, apex);
  assert.equal(trackedLandingRscResponse.status, 200);
  assert.equal(trackedLandingRscResponse.headers.get("location"), null);
  assert.match(trackedLandingRscResponse.headers.get("content-type") ?? "", /^text\/x-component\b/i);

  const privacyResponse = await render("/politica-de-privacidade", apex);
  assert.equal(privacyResponse.status, 200);

  const privacyRscResponse = await render("/politica-de-privacidade.rsc", apex);
  assert.equal(privacyRscResponse.status, 200);
  assert.equal(privacyRscResponse.headers.get("location"), null);
  assert.match(privacyRscResponse.headers.get("content-type") ?? "", /^text\/x-component\b/i);

  const sitelinkResponse = await render(`${landingPath}/como-funciona`, apex);
  assert.equal(sitelinkResponse.status, 200);
  assert.equal(sitelinkResponse.headers.get("location"), null);

  const sitelinkRscResponse = await render(`${landingPath}/como-funciona.rsc`, apex);
  assert.equal(sitelinkRscResponse.status, 200);
  assert.equal(sitelinkRscResponse.headers.get("location"), null);
  assert.match(sitelinkRscResponse.headers.get("content-type") ?? "", /^text\/x-component\b/i);

  const assetResponse = await render("/assets/logo.png", apex);
  assert.equal(assetResponse.headers.get("location"), null);
});

test("normalizes tracking parameters only for the internal HTML render", () => {
  const originalUrl = `https://integradaneuropsicologia.com.br${landingPath}?gclid=Click123&utm_source=google&GBRAID=BraID123&keep=functional`;
  const original = new Request(originalUrl, {
    headers: { accept: "text/html", "x-test-header": "preserved" },
  });

  const normalized = normalizeTrackingRequestForRender(original);

  assert.equal(normalized.url, `https://integradaneuropsicologia.com.br${landingPath}?keep=functional`);
  assert.equal(original.url, originalUrl);
  assert.equal(normalized.method, "GET");
  assert.equal(normalized.headers.get("x-test-header"), "preserved");
});

test("normalizes tracking names case-insensitively without touching functional parameters", () => {
  const request = new Request(`https://integradaneuropsicologia.com.br${landingPath}?GCLID=one&GCLID=two&Utm_Content=cta&_gl=linker&keep=yes`);
  assert.equal(
    normalizeTrackingRequestForRender(request).url,
    `https://integradaneuropsicologia.com.br${landingPath}?keep=yes`,
  );

  const functionalRequest = new Request(`https://integradaneuropsicologia.com.br${landingPath}?keep=functional`);
  assert.equal(normalizeTrackingRequestForRender(functionalRequest), functionalRequest);
});

test("maps every public landing HTML page to a versioned private static asset", () => {
  assert.equal(new Set(STATIC_HTML_PAGE_PATHS).size, STATIC_HTML_PAGE_PATHS.length);
  for (const pathname of STATIC_HTML_PAGE_PATHS) {
    const assetPath = staticHtmlAssetPath(pathname);
    assert.match(assetPath ?? "", /^\/integrada-static-html-cache\/v19\//);
    assert.match(assetPath ?? "", /\/index\.html$/);
    assert.equal(staticHtmlAssetRequestPath(pathname), assetPath?.slice(0, -"index.html".length));
  }
  assert.equal(staticHtmlAssetPath("/"), null);
  assert.equal(staticHtmlAssetPath(`${landingPath}.rsc`), null);
});

test("serves tracking-only landing requests from one stable pre-rendered asset", async () => {
  const requestedAssets = [];
  const assetsFetch = async (request) => {
    requestedAssets.push(request.url);
    return new Response("<!DOCTYPE html><html><body>STATIC-V19</body></html>", {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  };

  const first = await renderWithAssets(`${landingPath}?gclid=ClickOne&utm_source=google`, assetsFetch);
  const second = await renderWithAssets(`${landingPath}?wbraid=ClickTwo&gad_source=1`, assetsFetch);

  assert.equal(await first.text(), "<!DOCTYPE html><html><body>STATIC-V19</body></html>");
  assert.equal(await second.text(), "<!DOCTYPE html><html><body>STATIC-V19</body></html>");
  assert.equal(first.headers.get("x-integrada-html-cache"), "HIT");
  assert.equal(second.headers.get("x-integrada-html-cache"), "HIT");
  assert.equal(first.headers.get("x-vinext-cache"), "STATIC");
  for (const token of ["RSC", "Accept", "Next-Router-State-Tree", "Next-Url", "X-Vinext-Rsc-Render-Mode"]) {
    assert.match(first.headers.get("vary") ?? "", new RegExp(token, "i"));
  }
  assert.match(first.headers.get("cache-control") ?? "", /s-maxage=86400/i);
  assert.equal(requestedAssets.length, 2);
  assert.equal(requestedAssets[0], requestedAssets[1]);
  assert.equal(new URL(requestedAssets[0]).pathname, staticHtmlAssetRequestPath(landingPath));
  assert.equal(new URL(requestedAssets[0]).search, "");
});

test("bypasses pre-rendered HTML for functional parameters and unsafe asset responses", async () => {
  let functionalAssetCalls = 0;
  const functionalResponse = await renderWithAssets(`${landingPath}?keep=functional`, async () => {
    functionalAssetCalls += 1;
    return new Response("unexpected", { headers: { "content-type": "text/html" } });
  });
  assert.equal(functionalAssetCalls, 0);
  assert.equal(functionalResponse.headers.get("x-integrada-html-cache"), "MISS");
  assert.match(await functionalResponse.text(), /Avaliação neuropsicológica/i);

  const cookieResponse = await renderWithAssets(landingPath, async () => new Response("unsafe", {
    status: 200,
    headers: { "content-type": "text/html", "set-cookie": "private=value" },
  }));
  assert.equal(cookieResponse.headers.get("x-integrada-html-cache"), "MISS");
  assert.match(await cookieResponse.text(), /Avaliação neuropsicológica/i);

  const missingResponse = await renderWithAssets(landingPath, async () => new Response("missing", { status: 404 }));
  assert.equal(missingResponse.headers.get("x-integrada-html-cache"), "MISS");
  assert.match(await missingResponse.text(), /Avaliação neuropsicológica/i);
});

test("never serves the static document to stateful, ranged or RSC requests", async () => {
  for (const headers of [
    { authorization: "Bearer test" },
    { range: "bytes=0-100" },
    { rsc: "1" },
    { "next-action": "action-id" },
    { "next-router-state-tree": "state" },
    { cookie: "other=value; __prerender_bypass=preview" },
  ]) {
    let assetCalls = 0;
    await renderWithAssets(landingPath, async () => {
      assetCalls += 1;
      return new Response("unexpected", { headers: { "content-type": "text/html" } });
    }, "integradaneuropsicologia.com.br", { headers });
    assert.equal(assetCalls, 0, `static asset should be bypassed for ${Object.keys(headers)[0]}`);
  }
});

test("does not expose the internal static HTML asset path through the worker", async () => {
  const response = await render("/integrada-static-html-cache/v19/avaliacao-neuropsicologica-online-adultos/index.html", "integradaneuropsicologia.com.br");
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("location"), null);
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/i);
});

test("tracked landing requests remain public HTML without server-rendering identifiers", async () => {
  const response = await render(`${landingPath}?gclid=Click123&utm_source=google&utm_campaign=neuro`, "integradaneuropsicologia.com.br");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.doesNotMatch(html, /Click123|utm_source|utm_campaign/i);
  assert.match(html, new RegExp(`<link rel="canonical" href="https:\\/\\/integradaneuropsicologia\\.com\\.br${landingPath}"`, "i"));
});

test("server-renders a service route", async () => {
  const response = await render("/avaliacaoinfantil");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Diagnóstico infantil/);
  assert.match(html, /10 sessões/);
  assert.match(html, /Quero orientação para meu filho/);
});

test("educational checklists do not publish an automatic clinical score", async () => {
  const response = await render("/testetdahadulto");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Checklist de sinais de TDAH em adultos/);
  assert.match(html, /não calcula resultado clínico/i);
  assert.doesNotMatch(html, /sinais frequentes|resultado orientativo/i);
});

test("all 20 named game routes render their own activity", async (context) => {
  const games = [
    ["jogodolabirinto", "Jogo do Labirinto"],
    ["caca-rapida", "Caça-Rápida Verbal"],
    ["desafiohanoi", "Desafio Hanói"],
    ["resta-um-raciocinio-visual", "Resta Um"],
    ["sequênciainteligente", "Sequência Inteligente"],
    ["desafiodascores", "Desafio das Cores"],
    ["caca-fantasmas-agilidade-atencao", "Reflexo Fantasma"],
    ["torredelondresdigital", "Torre de Londres Digital"],
    ["quebra-cabeçaemoji", "Quebra-cabeça Emoji"],
    ["afirmou-bateu", "Afirmou, Bateu!"],
    ["memóriamix", "Memória Mix"],
    ["emojialvo", "Emoji Alvo"],
    ["intrusodaspalavras", "Intruso das Palavras"],
    ["cliquenomomentocerto", "Clique no Momento Certo"],
    ["cacacirculos", "Jogo do Círculo Rápido"],
    ["memorianumerica", "Memória Numérica"],
    ["buscadosímbolo", "Busca do Símbolo"],
    ["ordem-das-acoes", "Ordem das Ações"],
    ["palavra-emoji", "Palavra & Emoji"],
    ["sequênciadascores", "Sequência das Cores"],
  ];

  for (const [slug, title] of games) {
    await context.test(title, async () => {
      const response = await render(`/${slug}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.replaceAll("&amp;", "&").includes(title), `expected ${slug} to render ${title}`);
      assert.doesNotMatch(html, /Atividade indisponível/);
    });
  }
});

test("legacy URLs redirect to their canonical pages", async () => {
  const redirects = [
    ["/avaliacaoonline", landingPath],
    ["/avaliacaoneuropsicologicaadulto", landingPath],
    ["/avaliacaoonlineautismo", "/avaliacaoautismo"],
    ["/blank-4", "/teste-tdah-infantil"],
    ["/blank-6", "/teste-autismo-adulto"],
    ["/caca-palavras-estimulacao-cognitiva", "/caca-rapida"],
  ];

  for (const [source, destination] of redirects) {
    const response = await render(source);
    assert.ok([307, 308].includes(response.status), `${source} should redirect`);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, destination);
  }
});
