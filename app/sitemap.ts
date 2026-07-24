import type { MetadataRoute } from "next";
import { landingSitelinks, landingSitelinkPath } from "@/lib/landing-sitelinks";
import { LANDING_PATH, absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    LANDING_PATH,
    ...landingSitelinks.map(({ slug }) => landingSitelinkPath(slug)),
    "/politica-de-privacidade",
  ];

  return paths.map((pathname) => ({ url: absoluteUrl(pathname) }));
}
