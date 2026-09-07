const TRACKING_QUERY_PARAMETERS = new Set([
  "_gl",
  "dclid",
  "fbclid",
  "gad_campaignid",
  "gad_source",
  "gbraid",
  "gclid",
  "gclsrc",
  "msclkid",
  "srsltid",
  "wbraid",
]);

const isTrackingQueryParameter = (name: string) => {
  const normalizedName = name.toLowerCase();
  return normalizedName.startsWith("utm_") || TRACKING_QUERY_PARAMETERS.has(normalizedName);
};

/**
 * Removes client-read campaign identifiers only from the request used to
 * render static HTML. The original browser request and visible URL remain
 * unchanged, so GTM and offline attribution can still read those values.
 */
export function normalizeTrackingRequestForRender(request: Request) {
  const renderUrl = new URL(request.url);
  let changed = false;

  for (const name of [...renderUrl.searchParams.keys()]) {
    if (!isTrackingQueryParameter(name)) continue;
    renderUrl.searchParams.delete(name);
    changed = true;
  }

  return changed ? new Request(renderUrl, request) : request;
}
