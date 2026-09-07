export const STATIC_HTML_VERSION = "v19";

export const STATIC_HTML_PAGE_PATHS = [
  "/avaliacao-neuropsicologica-online-adultos",
  "/avaliacao-neuropsicologica-online-adultos/como-funciona",
  "/avaliacao-neuropsicologica-online-adultos/para-quem",
  "/avaliacao-neuropsicologica-online-adultos/o-que-investiga",
  "/avaliacao-neuropsicologica-online-adultos/duvidas",
  "/avaliacao-neuropsicologica-online-adultos/avaliacoes",
  "/avaliacao-neuropsicologica-online-adultos/contato",
  "/politica-de-privacidade",
] as const;

const STATIC_HTML_PAGE_PATH_SET = new Set<string>(STATIC_HTML_PAGE_PATHS);
const STATIC_HTML_ASSET_PREFIX = `/integrada-static-html-cache/${STATIC_HTML_VERSION}`;

export function staticHtmlAssetPath(pathname: string) {
  if (!STATIC_HTML_PAGE_PATH_SET.has(pathname)) return null;
  return `${STATIC_HTML_ASSET_PREFIX}${pathname}/index.html`;
}

export function staticHtmlAssetRequestPath(pathname: string) {
  const assetPath = staticHtmlAssetPath(pathname);
  return assetPath ? assetPath.slice(0, -"index.html".length) : null;
}
