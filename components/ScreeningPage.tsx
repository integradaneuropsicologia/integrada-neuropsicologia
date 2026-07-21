import { LeadForm } from "@/components/LeadForm";
import { ScreeningTest } from "@/components/ScreeningTest";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Screening } from "@/lib/site-data";

export function ScreeningPage({ screening }: { screening: Screening }) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="simple-hero">
          <span className="eyebrow">Checklist educativo gratuito • {screening.audience}</span>
          <h1>{screening.title}</h1>
          <p>{screening.description}</p>
        </section>
        <section className="screening-section">
          <p className="screening-disclaimer"><strong>Antes de começar:</strong> este checklist promove reflexão e não é um instrumento diagnóstico. As respostas ficam somente nesta página e não são enviadas à clínica.</p>
          <ScreeningTest screening={screening} />
        </section>
        <LeadForm context={screening.title} />
      </main>
      <SiteFooter />
    </>
  );
}
