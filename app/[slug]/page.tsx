import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogPage } from "@/components/BlogPage";
import { GameDetailPage } from "@/components/GameDetailPage";
import { GamesPage } from "@/components/GamesPage";
import { ScreeningPage } from "@/components/ScreeningPage";
import { ServicePage } from "@/components/ServicePage";
import { gameBySlug, gameLibrary } from "@/lib/game-data";
import { screenings, servicePages } from "@/lib/site-data";

type PageProps = { params: Promise<{ slug: string }> };

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
  if (servicePages[slug]) return { title: servicePages[slug].eyebrow, description: servicePages[slug].intro };
  if (screenings[slug]) return { title: `${screenings[slug].title} | Checklist gratuito`, description: screenings[slug].description };
  if (gameBySlug[slug]) return { title: gameBySlug[slug].title, description: gameBySlug[slug].description };
  if (slug === "blog") return { title: "Blog", description: "Conteúdos sobre neuropsicologia e saúde mental." };
  if (slug === "jogosdeestimulaçãomental") return { title: "Jogos de estimulação mental", description: "Atividades gratuitas para estimular memória e atenção." };
  return { title: { absolute: "Integrada Neuropsicologia" } };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "avaliacaoonlineautismo") redirect("/avaliacaoautismo");
  if (slug === "blank-4") redirect("/teste-tdah-infantil");
  if (slug === "blank-6") redirect("/teste-autismo-adulto");
  if (slug === "caca-palavras-estimulacao-cognitiva") redirect("/caca-rapida");
  if (servicePages[slug]) return <ServicePage data={servicePages[slug]} />;
  if (screenings[slug]) return <ScreeningPage screening={screenings[slug]} />;
  if (gameBySlug[slug]) return <GameDetailPage game={gameBySlug[slug]} />;
  if (slug === "blog") return <BlogPage />;
  if (slug === "jogosdeestimulaçãomental") return <GamesPage />;
  notFound();
}
