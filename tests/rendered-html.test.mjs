import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, /Consulte as experiências compartilhadas diretamente no Google/i);
  assert.match(html, /https:\/\/maps\.app\.goo\.gl\/UTfmE9ovaxSuGaCc9/);
  assert.match(html, /não reproduzimos relatos individuais neste site/i);
  assert.match(html, /Carla Luciana da Conceição Lima/);
  assert.match(html, /CRP 08\/39739/);
  assert.match(html, /src="\/assets\/hero-online\.webp"/);
  assert.match(html, /Autorizo, de forma específica, o tratamento do meu nome/i);
  assert.match(html, /O conteúdo do formulário não é armazenado no servidor deste site/i);
  assert.match(html, /href="\/politica-de-privacidade"/i);
  assert.match(html, /analytics_storage:\s*'denied'/i);
  assert.match(html, /ad_personalization:\s*'denied'/i);
  assert.match(html, /"@type":"LocalBusiness"/);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /"requiredMinAge":18/);
  assert.match(html, /"url":"https:\/\/integradaneuropsicologia\.com\.br\/avaliacao-neuropsicologica-online-adultos"/i);
  assert.match(html, /href="https:\/\/www\.integradaneuropsicologia\.com\.br\/avaliacaotdah"/i);
  assert.match(html, /href="https:\/\/www\.integradaneuropsicologia\.com\.br\/avaliacaoautismo"/i);
  assert.doesNotMatch(html, /aggregateRating|"@type":"Review"|"@type":"FAQPage"/);
  assert.doesNotMatch(html, /src="\/assets\/hero-family\.avif"/);
  assert.doesNotMatch(html, /Nada fica armazenado neste site/i);
  assert.doesNotMatch(html, /googletagmanager\.com|google-analytics\.com/i);
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
  assert.match(sitemap, /\/politica-de-privacidade<\/loc>/i);
  assert.doesNotMatch(sitemap, /\/avaliacaotdah<\/loc>|\/post\/|\/jogosdeestimula/i);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 2);
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

  const privacyResponse = await render("/politica-de-privacidade", apex);
  assert.equal(privacyResponse.status, 200);

  const assetResponse = await render("/assets/logo.png", apex);
  assert.equal(assetResponse.headers.get("location"), null);
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
