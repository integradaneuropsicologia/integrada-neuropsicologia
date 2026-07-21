import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the adult online assessment landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Avaliação Neuropsicológica Online para Adultos \| Integrada<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/integrada-neuropsicologia\.elieltonlimacosta\.chatgpt\.site\/"/i);
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
  assert.match(html, /"@type":"LocalBusiness"/);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /"requiredMinAge":18/);
  assert.doesNotMatch(html, /aggregateRating|"@type":"Review"|"@type":"FAQPage"/);
  assert.doesNotMatch(html, /src="\/assets\/hero-family\.avif"/);
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
  assert.match(robots, /Sitemap:\s*https:\/\/integrada-neuropsicologia\.elieltonlimacosta\.chatgpt\.site\/sitemap\.xml/i);

  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/integrada-neuropsicologia\.elieltonlimacosta\.chatgpt\.site\/<\/loc>/i);
  assert.match(sitemap, /\/avaliacaotdah<\/loc>/i);
  assert.match(sitemap, /\/post\/tdah-ansiedade-ou-burnout-como-diferenciar-em-adultos<\/loc>/i);
  assert.doesNotMatch(sitemap, /\/avaliacaoonline<\/loc>|\/avaliacaoneuropsicologicaadulto<\/loc>/i);
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
    ["/avaliacaoonline", "/"],
    ["/avaliacaoneuropsicologicaadulto", "/"],
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
