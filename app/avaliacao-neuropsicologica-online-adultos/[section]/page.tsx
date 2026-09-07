/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnlineAssessmentLeadForm } from "@/components/OnlineAssessmentLeadForm";
import {
  TrackedGoogleReviewsLink,
  TrackedWhatsAppLink,
} from "@/components/TrackedLandingLink";
import {
  getLandingSitelink,
  landingSitelinkPath,
  landingSitelinks,
} from "@/lib/landing-sitelinks";
import { LANDING_PATH, SITE_NAME } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site-data";

type PageProps = {
  params: Promise<{ section: string }>;
};

const directContact = whatsappUrl(
  "Olá! Quero saber como funciona a avaliação neuropsicológica 100% on-line para adultos.",
);
const googleReviewsUrl = "https://maps.app.goo.gl/UTfmE9ovaxSuGaCc9";

export const dynamic = "force-static";

export function generateStaticParams() {
  return landingSitelinks.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section } = await params;
  const item = getLandingSitelink(section);
  if (!item) return {};

  const canonical = landingSitelinkPath(item.slug);
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      siteName: SITE_NAME,
      title: item.title,
      description: item.description,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: ["/og.png"],
    },
  };
}

export default async function LandingSitelinkPage({ params }: PageProps) {
  const { section } = await params;
  const item = getLandingSitelink(section);
  if (!item) notFound();

  const isContact = item.slug === "contato";
  const isReviews = item.slug === "avaliacoes";
  const isFaq = item.slug === "duvidas";

  return (
    <div className="lp-page lp-sitelink-page">
      <header className="lp-header">
        <a className="lp-brand" href={LANDING_PATH}>
          <img src="/assets/logo.png" alt="" width={38} height={38} decoding="async" />
          <span><strong>Integrada</strong><small>Neuropsicologia</small></span>
        </a>
        <nav className="lp-nav" aria-label="Navegação da avaliação on-line">
          <a href={landingSitelinkPath("como-funciona")}>Como funciona</a>
          <a href={landingSitelinkPath("para-quem")}>Para quem é</a>
          <a href={landingSitelinkPath("duvidas")}>Dúvidas</a>
        </nav>
        <TrackedWhatsAppLink
          className="lp-header-cta"
          href={directContact}
          ctaLocation="header"
          target="_blank"
          rel="noreferrer"
        >
          Falar com a equipe
        </TrackedWhatsAppLink>
      </header>

      <main>
        <section className="lp-sitelink-hero">
          <div>
            <span className="lp-section-label">{item.eyebrow}</span>
            <h1>{item.title}</h1>
            <p>{item.intro}</p>
            <div className="lp-sitelink-actions">
              <TrackedWhatsAppLink
                className="lp-primary-button"
                href={directContact}
                ctaLocation="hero"
                target="_blank"
                rel="noreferrer"
              >
                Conversar sobre a avaliação <span aria-hidden="true">→</span>
              </TrackedWhatsAppLink>
              <a className="lp-quiet-link" href={LANDING_PATH}>Ver página completa</a>
            </div>
          </div>
          <aside aria-label="Resumo do atendimento">
            <span>Atendimento</span>
            <strong>100% on-line</strong>
            <p>Para brasileiros com 18 anos ou mais, no Brasil e em outros países.</p>
            <small>Mais de 15 anos de experiência profissional.</small>
          </aside>
        </section>

        <section className="lp-sitelink-content">
          <div className="lp-section-intro">
            <span className="lp-section-label">{item.label}</span>
            <h2>Informação clara para um próximo passo consciente.</h2>
          </div>

          <div className={`lp-sitelink-grid${isFaq ? " lp-sitelink-grid-faq" : ""}`}>
            {item.points.map((point, index) => (
              isFaq ? (
                <details key={point.title} open={index === 0}>
                  <summary>{point.title}<span aria-hidden="true">+</span></summary>
                  <p>{point.text}</p>
                </details>
              ) : (
                <article key={point.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </article>
              )
            ))}
          </div>

          {isReviews && (
            <TrackedGoogleReviewsLink
              className="lp-sitelink-review-link"
              href={googleReviewsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>Google</span>
              <strong>Abrir o perfil oficial da Integrada</strong>
              <b>Consultar avaliações publicadas <span aria-hidden="true">→</span></b>
            </TrackedGoogleReviewsLink>
          )}

          {isContact && (
            <div className="lp-sitelink-form">
              <OnlineAssessmentLeadForm placement="section" />
            </div>
          )}

          <aside className="lp-sitelink-note">
            <span aria-hidden="true">i</span>
            <p><strong>Orientação responsável:</strong> {item.note}</p>
          </aside>
        </section>

        <section className="lp-final-cta">
          <div>
            <span>Integrada Neuropsicologia</span>
            <h2>Compreender o que acontece pode tornar o próximo passo mais claro.</h2>
          </div>
          <TrackedWhatsAppLink
            className="lp-light-button"
            href={directContact}
            ctaLocation="final"
            target="_blank"
            rel="noreferrer"
          >
            Verificar disponibilidade <span aria-hidden="true">→</span>
          </TrackedWhatsAppLink>
        </section>
      </main>

      <footer className="lp-footer lp-sitelink-footer">
        <div className="lp-footer-brand">
          <img src="/assets/logo.png" alt="" width={38} height={38} loading="lazy" decoding="async" />
          <span><strong>Integrada Neuropsicologia</strong><small>Avaliando o presente, transformando o futuro.</small></span>
        </div>
        <div>
          <strong>Responsável técnica</strong>
          <span>Carla Luciana da Conceição Lima</span>
          <span>Psicóloga • CRP 08/39739</span>
        </div>
        <div>
          <strong>Informações</strong>
          <a href={LANDING_PATH}>Avaliação on-line</a>
          <a href="/politica-de-privacidade">Política de Privacidade</a>
        </div>
        <p>© {new Date().getFullYear()} Integrada Neuropsicologia. Conteúdo informativo; não substitui avaliação individual.</p>
      </footer>

      <TrackedWhatsAppLink
        className="lp-floating-cta"
        href={directContact}
        ctaLocation="floating_mobile"
        target="_blank"
        rel="noreferrer"
      >
        Conversar pelo WhatsApp <span aria-hidden="true">→</span>
      </TrackedWhatsAppLink>
    </div>
  );
}
