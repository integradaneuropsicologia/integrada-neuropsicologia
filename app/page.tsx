import { LeadForm } from "@/components/LeadForm";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { testNav, whatsappUrl } from "@/lib/site-data";

const services = [
  { title: "INFANTOJUVENIL", text: "Dificuldades no desenvolvimento, aprendizagem, TDAH, TEA, altas habilidades e desregulação emocional.", image: "/assets/infantojuvenil.avif", href: "/avaliacaoinfantil" },
  { title: "ADULTO", text: "Dificuldades de atenção, memória e organização. TDAH, ansiedade ou alterações cognitivas.", image: "/assets/adulto.avif", href: "/avaliacaoneuropsicologicaadulto" },
  { title: "IDOSO", text: "Esquecimentos e dificuldades funcionais. Avaliação pré-operatória e monitoramento cognitivo.", image: "/assets/idoso.avif", href: "/avaliacaoneuropsicologicaidoso" },
  { title: "Avaliação on-line", text: "Atenção, memória, raciocínio, produtividade e saúde mental — sem deslocamento.", image: "/assets/online.avif", href: "/avaliacaoonline" },
  { title: "Psicoterapia (TCC)", text: "Terapia prática, com metas claras e estratégias para o dia a dia.", image: "/assets/psicoterapia.avif", href: "/terapiaparaadultos" },
];

const values = [
  ["Profissionais qualificados", "Atualização constante e rigor técnico."], ["Atendimento personalizado", "Plano centrado na sua necessidade."],
  ["Agilidade nos laudos", "Rapidez sem perder qualidade."], ["Variedade de testes", "Bateria completa e atualizada."],
];

const carePromises = [
  ["Escuta desde o primeiro contato", "A equipe entende a necessidade antes de orientar o caminho."],
  ["Processo explicado com clareza", "Você sabe o objetivo de cada etapa e o que acontece depois."],
  ["Orientação para a vida real", "A devolutiva transforma informações em próximos passos possíveis."],
];

export default function Home() {
  const contact = whatsappUrl();
  return <><SiteHeader /><main>
    <section className="home-hero"><div className="home-hero-copy"><span className="eyebrow">Avaliação neuropsicológica e psicoterapia</span><h1>Avaliando o presente,<br />transformando o futuro!</h1><p>Clareza para compreender o que está acontecendo e escolher o cuidado certo. Atendimento humanizado, laudos objetivos e orientação prática para crianças, adultos e idosos.</p><div className="hero-actions"><a className="button button-green" href={contact} target="_blank" rel="noreferrer">Falar com uma especialista</a><a className="text-link" href="#servicos">Conhecer os serviços <span aria-hidden="true">↓</span></a></div><p className="cta-note">Conte sua necessidade. A equipe orienta o melhor caminho.</p></div><div className="home-hero-image"><Image src="/assets/hero-family.avif" alt="Família reunida ao ar livre" width={760} height={700} sizes="(max-width: 860px) 100vw, 45vw" priority unoptimized /></div></section>
    <section className="trust-strip" aria-label="Diferenciais da clínica"><div><strong>14+ anos</strong><span>de experiência clínica</span></div><div><strong>Atendimento humano</strong><span>escuta antes de qualquer decisão</span></div><div><strong>Laudos claros</strong><span>orientação que vira ação</span></div><div><strong>Presencial e on-line</strong><span>Curitiba e todo o Brasil</span></div></section>
    <section className="services-section" id="servicos"><div className="section-heading"><span className="eyebrow">Como podemos ajudar</span><h2>Encontre o cuidado certo para cada fase da vida</h2><p>Escolha a situação que mais se aproxima da sua necessidade. Se ainda houver dúvida, fale com a equipe antes de agendar.</p></div><div className="service-card-grid">{services.map((service) => <article key={service.title}><Image src={service.image} alt="" width={500} height={360} sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw" unoptimized /><div><h3>{service.title}</h3><p>{service.text}</p><div className="card-actions"><Link href={service.href} className="button button-outline">Conhecer serviço</Link><a href={whatsappUrl(`Olá! Quero tirar dúvidas sobre ${service.title.toLowerCase()}.`)} target="_blank" rel="noreferrer" className="button button-green">Tirar dúvidas</a></div></div></article>)}</div></section>
    <section className="home-evaluation"><div><span className="eyebrow">Precisão que orienta</span><h2>Avaliação<br />Neuropsicológica</h2><p>Quando você compreende o quadro com mais clareza, fica mais fácil escolher um cuidado direcionado e construir estratégias para a rotina.</p><a className="button button-green" href={contact} target="_blank" rel="noreferrer">Agendar avaliação</a></div><div className="value-list">{values.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="testimonials-section"><div className="section-heading"><span className="eyebrow">O que você pode esperar</span><h2>Clareza e cuidado em cada etapa</h2></div><div className="testimonial-grid">{carePromises.map(([title, text]) => <article key={title}><span className="care-card-mark" aria-hidden="true">✓</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="free-content" id="testes"><div className="section-heading light"><span className="eyebrow">Comece agora</span><h2>Checklists gratuitos & conteúdos</h2></div><div className="free-content-grid">{testNav.slice(0, 3).map(([name, href], index) => <Link key={href} href={href}><span>0{index + 1}</span><h3>{name}</h3><p>Reflexão educativa, sem pontuação diagnóstica.</p><strong>Ver checklist →</strong></Link>)}<Link href="/jogosdeestimulaçãomental"><span>04</span><h3>Jogos cerebrais</h3><p>Exercite memória e atenção.</p><strong>Jogar grátis →</strong></Link></div></section>
    <LeadForm context="Página inicial" />
  </main><a className="whatsapp-float" href={contact} target="_blank" rel="noreferrer" aria-label="Falar com a Integrada pelo WhatsApp">Falar agora</a><SiteFooter /></>;
}
