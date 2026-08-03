/** Cloudflare Worker entry point for the Integrada website. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const APEX_HOST = "integradaneuropsicologia.com.br";
const WIX_SITE_URL = "https://www.integradaneuropsicologia.com.br";
const LANDING_PATH = "/avaliacao-neuropsicologica-online-adultos";
const SITES_PAGE_PATHS = new Set([
  LANDING_PATH,
  `${LANDING_PATH}/como-funciona`,
  `${LANDING_PATH}/para-quem`,
  `${LANDING_PATH}/o-que-investiga`,
  `${LANDING_PATH}/duvidas`,
  `${LANDING_PATH}/avaliacoes`,
  `${LANDING_PATH}/contato`,
  "/politica-de-privacidade",
]);

const HTML_CACHE_CONTROL = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

const normalizeSitesPagePath = (pathname: string) => {
  const withoutRsc = pathname.endsWith(".rsc") ? pathname.slice(0, -4) : pathname;
  return withoutRsc.length > 1 && withoutRsc.endsWith("/")
    ? withoutRsc.slice(0, -1)
    : withoutRsc;
};

const isSitesPath = (pathname: string) =>
  SITES_PAGE_PATHS.has(normalizeSitesPagePath(pathname)) ||
  pathname === "/robots.txt" ||
  pathname === "/sitemap.xml" ||
  pathname === "/og.png" ||
  pathname.startsWith("/.well-known/") ||
  pathname.startsWith("/assets/") ||
  pathname.startsWith("/cdn-cgi/") ||
  pathname.startsWith("/_next/") ||
  pathname.startsWith("/_vinext/");

const isCacheableHtmlRequest = (request: Request, pathname: string) =>
  request.method === "GET" &&
  request.headers.get("accept")?.includes("text/html") === true &&
  SITES_PAGE_PATHS.has(normalizeSitesPagePath(pathname));

const cacheableResponse = (response: Response) => {
  const result = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
  result.headers.set("Cache-Control", HTML_CACHE_CONTROL);
  return result;
};

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === APEX_HOST && !isSitesPath(url.pathname)) {
      const wixUrl = new URL(WIX_SITE_URL);
      wixUrl.pathname = url.pathname;
      wixUrl.search = url.search;
      return Response.redirect(wixUrl, 308);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (isCacheableHtmlRequest(request, url.pathname)) {
      const cacheUrl = new URL(request.url);
      cacheUrl.search = "";
      const cacheKey = new Request(cacheUrl.toString(), {
        method: "GET",
        headers: { accept: "text/html" },
      });
      const edgeCache = (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
      const cached = await edgeCache?.match(cacheKey);
      if (cached) return cached;

      const response = await handler.fetch(request, env, ctx);
      if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return response;

      const result = cacheableResponse(response);
      if (edgeCache) ctx.waitUntil(edgeCache.put(cacheKey, result.clone()));
      return result;
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
