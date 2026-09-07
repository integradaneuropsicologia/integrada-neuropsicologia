/** Cloudflare Worker entry point for the Integrada website. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { normalizeTrackingRequestForRender } from "../lib/request-normalization";
import { STATIC_HTML_PAGE_PATHS, staticHtmlAssetRequestPath } from "../lib/static-html";

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
const WWW_SITE_URL = "https://www.integradaneuropsicologia.com.br";
const SITES_PAGE_PATHS = new Set<string>(STATIC_HTML_PAGE_PATHS);

const HTML_CACHE_CONTROL = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";
const VINEXT_HTML_VARY = [
  "RSC",
  "Accept",
  "Next-Router-State-Tree",
  "Next-Router-Prefetch",
  "Next-Router-Segment-Prefetch",
  "Next-Url",
  "X-Vinext-Interception-Context",
  "X-Vinext-Mounted-Slots",
  "X-Vinext-Rsc-Render-Mode",
].join(", ");

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

const preRenderedHtmlResponse = async (request: Request, env: Env) => {
  if (
    request.headers.has("authorization") ||
    request.headers.has("range") ||
    request.headers.has("rsc") ||
    request.headers.has("next-action") ||
    request.headers.has("next-router-state-tree") ||
    /(?:^|;\s*)__prerender_bypass=/.test(request.headers.get("cookie") ?? "")
  ) return null;

  const renderRequest = normalizeTrackingRequestForRender(request);
  const renderUrl = new URL(renderRequest.url);
  if (renderUrl.search) return null;

  const assetPath = staticHtmlAssetRequestPath(renderUrl.pathname);
  if (!assetPath) return null;

  try {
    const assetUrl = new URL(assetPath, request.url);
    const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, {
      method: "GET",
      headers: { accept: "text/html" },
    }));
    if (
      assetResponse.status !== 200 ||
      !assetResponse.headers.get("content-type")?.includes("text/html") ||
      assetResponse.headers.has("set-cookie")
    ) return null;

    const response = cacheableResponse(assetResponse);
    response.headers.set("Vary", VINEXT_HTML_VARY);
    response.headers.set("X-Vinext-Cache", "STATIC");
    response.headers.set("X-Integrada-Html-Cache", "HIT");
    return response;
  } catch {
    return null;
  }
};

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/integrada-static-html-cache/")) {
      return new Response("Not found", {
        status: 404,
        headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
      });
    }

    if (url.hostname === APEX_HOST && !isSitesPath(url.pathname)) {
      const mainSiteUrl = new URL(WWW_SITE_URL);
      mainSiteUrl.pathname = url.pathname;
      mainSiteUrl.search = url.search;
      return Response.redirect(mainSiteUrl, 308);
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
      const preRenderedResponse = await preRenderedHtmlResponse(request, env);
      if (preRenderedResponse) return preRenderedResponse;

      const renderRequest = normalizeTrackingRequestForRender(request);
      const response = await handler.fetch(renderRequest, env, ctx);
      if (
        response.status !== 200 ||
        !response.headers.get("content-type")?.includes("text/html") ||
        response.headers.has("set-cookie")
      ) return response;

      const renderedResponse = cacheableResponse(response);
      renderedResponse.headers.set("X-Integrada-Html-Cache", "MISS");
      return renderedResponse;
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
