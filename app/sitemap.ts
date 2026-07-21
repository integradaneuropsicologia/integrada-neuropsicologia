import type { MetadataRoute } from "next";
import { LANDING_PATH, absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    LANDING_PATH,
    "/politica-de-privacidade",
  ];

  return paths.map((pathname) => ({ url: absoluteUrl(pathname) }));
}
