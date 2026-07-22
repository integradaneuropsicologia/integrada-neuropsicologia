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

const isSitesPath = (pathname: string) =>
  pathname === LANDING_PATH ||
  pathname === `${LANDING_PATH}/` ||
  pathname === `${LANDING_PATH}.rsc` ||
  pathname === "/politica-de-privacidade" ||
  pathname === "/politica-de-privacidade/" ||
  pathname === "/politica-de-privacidade.rsc" ||
  pathname === "/robots.txt" ||
  pathname === "/sitemap.xml" ||
  pathname === "/og.png" ||
  pathname.startsWith("/.well-known/") ||
  pathname.startsWith("/assets/") ||
  pathname.startsWith("/cdn-cgi/") ||
  pathname.startsWith("/_next/") ||
  pathname.startsWith("/_vinext/");

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

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
