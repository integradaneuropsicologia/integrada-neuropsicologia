import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogPage } from "@/components/BlogPage";
import { GameDetailPage } from "@/components/GameDetailPage";
import { GamesPage } from "@/components/GamesPage";
import { ScreeningPage } from "@/components/ScreeningPage";
import { ServicePage } from "@/components/ServicePage";
import { gameBySlug, gameLibrary } from "@/lib/game-data";
import { LANDING_PATH, mainSiteUrl } from "@/lib/seo";
import { screenings, servicePages } from "@/lib/site-data";

type PageProps = { params: Promise<{ slug: string }> };

const pageMetadata = (slug: string, title: string, description: string): Metadata => ({
  title,
  description,
  alternates: { canonical: mainSiteUrl(`/${slug}`) },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Integrada Neuropsicologia",
    url: mainSiteUrl(`/${slug}`),
    title,
    description,
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Integrada Neuropsicologia" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
});

export function generateStaticParams() {
  return [
    ...Object.keys(servicePages),
    ...Object.keys(screenings),
    ...gameLibrary.map((game) => game.slug),
    "blog",
    "jogosdeestimulaçãomental",
    "avaliacaoonlineautismo",
    "blank-4",
    "blank-6",
    "caca-palavras-estimulacao-cognitiva",
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "avaliacaoonline" || slug === "avaliacaoneuropsicologicaadulto") {
    return { title: { absolute: "Avaliação Neuropsicológica Online para Adultos | Integrada" }, alternates: { canonical: LANDING_PATH } };
  }
  if (servicePages[slug]) return pageMetadata(slug, servicePages[slug].eyebrow, servicePages[slug].intro);
  if (screenings[slug]) return pageMetadata(slug, `${screenings[slug].title} | Checklist gratuito`, screenings[slug].description);
  if (gameBySlug[slug]) return pageMetadata(slug, gameBySlug[slug].title, gameBySlug[slug].description);
  if (slug === "blog") return pageMetadata(slug, "Blog", "Conteúdos sobre neuropsicologia, avaliação e saúde mental.");
  if (slug === "jogosdeestimulaçãomental") return pageMetadata(slug, "Jogos de estimulação mental", "Atividades gratuitas para estimular memória e atenção.");
  return { title: { absolute: "Integrada Neuropsicologia" } };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "avaliacaoonline" || slug === "avaliacaoneuropsicologicaadulto") permanentRedirect(LANDING_PATH);
  if (slug === "avaliacaoonlineautismo") permanentRedirect("/avaliacaoautismo");
  if (slug === "blank-4") permanentRedirect("/teste-tdah-infantil");
  if (slug === "blank-6") permanentRedirect("/teste-autismo-adulto");
  if (slug === "caca-palavras-estimulacao-cognitiva") permanentRedirect("/caca-rapida");
  if (servicePages[slug]) return <ServicePage data={servicePages[slug]} />;
  if (screenings[slug]) return <ScreeningPage screening={screenings[slug]} />;
  if (gameBySlug[slug]) return <GameDetailPage game={gameBySlug[slug]} />;
  if (slug === "blog") return <BlogPage />;
  if (slug === "jogosdeestimulaçãomental") return <GamesPage />;
  notFound();
}
