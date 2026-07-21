import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { gameLibrary } from "@/lib/game-data";
import { absoluteUrl } from "@/lib/seo";
import { screenings, servicePages } from "@/lib/site-data";

const consolidatedServiceSlugs = new Set(["avaliacaoonline", "avaliacaoneuropsicologicaadulto"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/politica-de-privacidade",
    ...Object.keys(servicePages)
      .filter((slug) => !consolidatedServiceSlugs.has(slug))
      .map((slug) => `/${slug}`),
    ...Object.keys(screenings).map((slug) => `/${slug}`),
    "/blog",
    ...blogPosts.map(({ slug }) => `/post/${slug}`),
    "/jogosdeestimulaçãomental",
    ...gameLibrary.map(({ slug }) => `/${slug}`),
  ];

  return [...new Set(paths)].map((pathname) => ({ url: absoluteUrl(pathname) }));
}
