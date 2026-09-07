import Link from "next/link";
import Image from "next/image";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { evaluationNav, testNav, therapyNav, whatsappUrl } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div>
          <span className="eyebrow">Cuidado com clareza</span>
          <h2>Atendimento humanizado, integração e orientação prática.</h2>
        </div>
        <a className="button button-light" href={whatsappUrl()} target="_blank" rel="noreferrer">Falar com a equipe</a>
      </div>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand brand-footer">
            <span className="brand-mark"><Image src="/assets/logo.png" alt="" width={32} height={32} unoptimized /></span>
            <strong>Integrada Neuropsicologia</strong>
          </Link>
          <p>Rua Jacarezinho, 1266, Mercês<br />CEP 80810-130 — Curitiba/PR</p>
          <a href="tel:+5541992113665">(41) 99211-3665</a>
        </div>
        <div><h3>Avaliação</h3>{evaluationNav.map(([n, h]) => <Link key={h} href={h}>{n}</Link>)}</div>
        <div><h3>Psicoterapia</h3>{therapyNav.map(([n, h]) => <Link key={h} href={h}>{n}</Link>)}</div>
        <div><h3>Conteúdos</h3>{testNav.map(([n, h]) => <Link key={h} href={h}>{n}</Link>)}<Link href="/blog">Blog</Link><Link href="/jogosdeestimulaçãomental">Jogos mentais</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Integrada Neuropsicologia</span><span className="footer-privacy-links"><Link href="/politica-de-privacidade">Política de Privacidade</Link><CookieSettingsButton /></span><span>Curitiba • Atendimento presencial e on-line</span></div>
    </footer>
  );
}
