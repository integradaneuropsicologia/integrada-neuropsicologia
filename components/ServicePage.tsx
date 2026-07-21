import { LeadForm } from "@/components/LeadForm";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ServicePageData, whatsappUrl } from "@/lib/site-data";

const processPromises = [
  ["Escuta cuidadosa", "A demanda e o contexto vêm antes da indicação de qualquer caminho."],
  ["Etapas transparentes", "O processo, os objetivos e a devolutiva são explicados em linguagem clara."],
  ["Orientação aplicável", "As recomendações consideram rotina, relações e rede de cuidado."],
];

export function ServicePage({ data }: { data: ServicePageData }) {
  const contact = whatsappUrl(`Olá! Gostaria de saber mais sobre ${data.eyebrow.toLowerCase()}.`);
  return (
    <>
      <SiteHeader />
      <main>
        <section className="service-hero">
          <div className="service-hero-copy">
            <span className="eyebrow">{data.eyebrow}</span>
            <h1>{data.title}</h1>
            <p>{data.intro}</p>
            <a className="button button-green" href={contact} target="_blank" rel="noreferrer">{data.cta}</a>
            <p className="cta-note">Converse com a equipe e entenda o próximo passo mais adequado.</p>
          </div>
          <div className="service-hero-image"><Image src={data.image} alt={data.imageAlt} width={760} height={720} sizes="(max-width: 860px) 100vw, 45vw" priority unoptimized /></div>
        </section>
        <section className="trust-strip" aria-label="Diferenciais da clínica">
          <div><strong>14+ anos</strong><span>de experiência clínica</span></div>
          <div><strong>Atendimento humano</strong><span>escuta antes de qualquer decisão</span></div>
          <div><strong>Laudo aplicável</strong><span>orientações claras para a rotina</span></div>
          <div><strong>Presencial e on-line</strong><span>cuidado que cabe na sua realidade</span></div>
        </section>

        <section className="content-section">
          <div className="section-heading"><span className="eyebrow">Cuidado completo</span><h2>{data.whyTitle}</h2></div>
          <div className="highlight-grid">
            {data.highlights.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </section>

        <section className="split-section">
          <div className="split-copy"><span className="eyebrow">Observe os sinais</span><h2>{data.signsTitle}</h2><p>{data.signsIntro}</p><a href={contact} target="_blank" rel="noreferrer" className="text-link">Quero orientação <span aria-hidden="true">→</span></a></div>
          <ul className="signal-list">{data.signs.map((sign) => <li key={sign}>{sign}</li>)}</ul>
        </section>

        <section className="process-section">
          <div className="section-heading light"><span className="eyebrow">Passo a passo</span><h2>{data.processTitle}</h2></div>
          <div className="process-grid">{data.process.map((step) => <article key={step.title}><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </section>

        <section className="testimonials-section">
          <div className="section-heading"><span className="eyebrow">Compromisso com o cuidado</span><h2>O que orienta cada atendimento</h2></div>
          <div className="testimonial-grid">{processPromises.map(([title, text]) => <article key={title}><span className="care-card-mark" aria-hidden="true">✓</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="closing-band"><div><span className="eyebrow">Próximo passo</span><h2>{data.closingTitle}</h2><p>{data.closingText}</p></div><a className="button button-light" href={contact} target="_blank" rel="noreferrer">Ver disponibilidade</a></section>
        <LeadForm context={data.eyebrow} />
      </main>
      <a className="whatsapp-float" href={contact} target="_blank" rel="noreferrer" aria-label="Falar com a Integrada pelo WhatsApp">WhatsApp</a>
      <SiteFooter />
    </>
  );
}
