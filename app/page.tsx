import type { Metadata } from "next";
import Image from "next/image";
import { OnlineAssessmentLeadForm } from "@/components/OnlineAssessmentLeadForm";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site-data";

const directContact = whatsappUrl("Olá! Quero saber como funciona a avaliação neuropsicológica 100% on-line para brasileiros com 18 anos ou mais.");
const googleReviewsUrl = "https://maps.app.goo.gl/UTfmE9ovaxSuGaCc9";
const googleBusinessProfileUrl = "https://www.google.com/maps/place/Integrada+Neuropsicologia/@-25.4189171,-49.2934842,17z/data=!4m6!3m5!1s0x94dce739ecd69343:0x9f5ef5dec16989d1!8m2!3d-25.4189171!4d-49.2909093!16s%2Fg%2F11wf_7qw1b";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE_NAME,
    title: "Avaliação Neuropsicológica Online para Adultos (18+)",
    description: "Avaliação 100% online para brasileiros adultos, no Brasil e no exterior, com investigação de foco, memória, organização e relacionamentos.",
    images: [{
      url: "/og.png",
      width: 1731,
      height: 909,
      alt: "Avaliação neuropsicológica online para adultos — Integrada Neuropsicologia",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avaliação Neuropsicológica Online para Adultos (18+)",
    description: "Avaliação 100% online para brasileiros adultos, no Brasil e no exterior.",
    images: ["/og.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      dateModified: "2026-07-21",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#service` },
      mainEntity: { "@id": `${SITE_URL}/#service` },
      primaryImageOfPage: { "@id": `${SITE_URL}/#primaryimage` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "pt-BR",
    },
    {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#primaryimage`,
      url: absoluteUrl("/assets/hero-online.webp"),
      contentUrl: absoluteUrl("/assets/hero-online.webp"),
      width: 1200,
      height: 630,
      caption: "Pessoa adulta participando de avaliação neuropsicológica online em ambiente privativo",
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: "Avaliação neuropsicológica 100% online para brasileiros com 18 anos ou mais, no Brasil e no exterior.",
      telephone: "+5541992113665",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/assets/logo.png"),
        width: 500,
        height: 500,
      },
      image: { "@id": `${SITE_URL}/#primaryimage` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rua Jacarezinho, 1266, Mercês",
        addressLocality: "Curitiba",
        addressRegion: "PR",
        postalCode: "80810-130",
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -25.4189171,
        longitude: -49.2909093,
      },
      sameAs: [googleBusinessProfileUrl],
      areaServed: [
        { "@type": "Country", name: "Brasil" },
        "Brasileiros residentes no exterior",
      ],
      employee: { "@id": `${SITE_URL}/#carla` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#carla`,
      name: "Carla Luciana da Conceição Lima",
      jobTitle: "Psicóloga e responsável técnica",
      identifier: {
        "@type": "PropertyValue",
        propertyID: "CRP",
        value: "08/39739",
      },
      worksFor: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      name: "Avaliação neuropsicológica online para adultos",
      serviceType: "Avaliação neuropsicológica 100% online",
      description: "Processo clínico para compreender dificuldades de foco, memória, organização e relacionamento, com devolutiva individual e orientação sobre os próximos passos.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [
        { "@type": "Country", name: "Brasil" },
        "Brasileiros residentes no exterior",
      ],
      audience: {
        "@type": "PeopleAudience",
        audienceType: "Brasileiros adultos",
        requiredMinAge: 18,
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE_URL}/`,
        availableLanguage: "Português",
      },
    },
  ],
};

const signals = [
  ["Foco que escapa", "Você perde o fio em reuniões, leituras ou conversas, mesmo quando tenta prestar atenção."],
  ["Rotina difícil de organizar", "Prazos, compromissos e tarefas parecem exigir muito mais esforço do que deveriam."],
  ["Esquecimentos frequentes", "Informações, objetos e decisões importantes somem da memória no meio do dia."],
  ["Produtividade instável", "Há dias de hiperfoco e outros em que começar ou concluir algo parece impossível."],
  ["Sobrecarga sensorial", "Luzes, sons, cheiros, texturas ou ambientes movimentados podem causar exaustão e exigir tempo para se recuperar."],
  ["Interações que exigem muito", "Conversas em grupo, códigos implícitos e expectativas sociais podem exigir monitoramento constante e deixar você esgotado."],
  ["Mudanças que desorganizam", "Alterações inesperadas de planos, rotinas ou contextos podem gerar desconforto e dificultar a retomada do dia."],
  ["Cansaço de se adaptar", "Você ensaia respostas, imita comportamentos ou esconde desconfortos para parecer dar conta — e termina exausto."],
  ["Dúvidas sem resposta", "TDAH, autismo, ansiedade ou burnout parecem explicar partes do que acontece — mas não o todo."],
] as const;

const benefits = [
  ["Investigação além do sintoma", "Cognição, emoções, histórico e rotina são integrados para compreender o impacto real das dificuldades."],
  ["Processo planejado para o on-line", "Da entrevista à devolutiva, todas as etapas são organizadas para acontecer a distância, com procedimentos adequados à modalidade."],
  ["Processo explicado com clareza", "Você entende o objetivo de cada etapa e quais perguntas a avaliação busca responder."],
  ["Devolutiva que orienta", "Os resultados são apresentados em linguagem acessível, com recomendações e encaminhamentos quando necessários."],
] as const;

const investigationTopics = [
  {
    title: "TDAH em adultos",
    text: "Atenção, impulsividade, memória de trabalho, organização e o impacto desses padrões em diferentes fases da vida.",
    href: "/avaliacaotdah",
    link: "Entender a investigação de TDAH",
  },
  {
    title: "Autismo na vida adulta",
    text: "Comunicação, interação social, flexibilidade, sensibilidades sensoriais e estratégias de adaptação construídas ao longo da vida.",
    href: "/avaliacaoautismo",
    link: "Entender a investigação de autismo",
  },
  {
    title: "Memória e funções executivas",
    text: "Como atenção, memória, planejamento, velocidade de processamento e tomada de decisão se relacionam com as dificuldades atuais.",
    href: "/post/avaliação-neuropsicológica-x-avaliação-neurológica-qual-é-a-diferença",
    link: "Entender o que a avaliação investiga",
  },
  {
    title: "Hipóteses que podem se confundir",
    text: "TDAH, ansiedade e burnout podem compartilhar sinais. A avaliação considera história, contexto e impacto funcional para olhar o conjunto.",
    href: "/post/tdah-ansiedade-ou-burnout-como-diferenciar-em-adultos",
    link: "Ler sobre TDAH, ansiedade e burnout",
  },
] as const;

const process = [
  ["01", "Contato e alinhamento", "A equipe conhece sua demanda, explica como funciona a avaliação on-line e orienta sobre as condições necessárias para começar."],
  ["02", "Entrevista inicial", "Histórico, dificuldades atuais e objetivos são organizados para planejar a investigação."],
  ["03", "Sessões de avaliação", "Procedimentos e instrumentos adequados à modalidade remota são selecionados para o seu caso, conforme as normas profissionais."],
  ["04", "Integração dos dados", "As informações são analisadas em conjunto, considerando funcionamento cognitivo, emocional e cotidiano."],
  ["05", "Devolutiva e documentação", "Você recebe uma explicação clara dos achados, documentação cabível e orientação para os próximos passos."],
] as const;

const faqs = [
  ["Para quem é a avaliação neuropsicológica on-line?", "Para brasileiros com 18 anos ou mais, no Brasil ou no exterior, que desejam compreender dificuldades cognitivas, emocionais ou comportamentais com impacto na rotina, nos estudos, no trabalho ou nos relacionamentos."],
  ["Ela pode investigar TDAH ou autismo em pessoas com 18 anos ou mais?", "Pode contribuir para a investigação dessas e de outras hipóteses. Nenhum teste isolado confirma um diagnóstico, e a avaliação não garante que uma hipótese inicial será confirmada."],
  ["Todo o processo acontece on-line?", "Sim. A avaliação foi planejada para acontecer integralmente on-line, da entrevista inicial à devolutiva e à entrega da documentação."],
  ["Os instrumentos são adequados ao formato remoto?", "Sim. São selecionados procedimentos e instrumentos compatíveis com a aplicação on-line e com o objetivo da avaliação, conforme as normas profissionais vigentes."],
  ["Quanto tempo dura?", "O processo costuma ser organizado em torno de 8 encontros. A duração e o planejamento são definidos conforme a demanda e organizados a partir da entrevista inicial."],
  ["O que preciso para participar?", "Em geral, conexão estável, câmera, computador ou notebook e um ambiente silencioso e privativo. As orientações específicas são fornecidas antes do início."],
  ["Vocês atendem brasileiros que vivem no exterior?", "Sim. O atendimento on-line também recebe brasileiros que vivem em outros países. Os horários dos encontros são combinados considerando o fuso de cada pessoa."],
  ["Receberei uma devolutiva?", "Sim. Ao final, os resultados são explicados e é apresentada a documentação correspondente ao escopo da avaliação e às normas aplicáveis."],
  ["Preciso de encaminhamento médico para fazer a avaliação?", "Em geral, não. Você pode procurar a equipe diretamente para compreender como funciona o processo. Quando houver encaminhamento de outro profissional, essa informação pode ser integrada ao planejamento."],
  ["A avaliação neuropsicológica on-line é confiável?", "O processo pode oferecer informações clínicas úteis quando é conduzido com entrevista cuidadosa, procedimentos adequados à modalidade remota e integração dos dados. Nenhum resultado isolado substitui a análise do conjunto."],
  ["A documentação on-line pode ser usada no exterior?", "A documentação é elaborada conforme o escopo da avaliação e as normas profissionais brasileiras. A aceitação em outro país depende da finalidade e das regras da instituição ou autoridade que receberá o documento; por isso, vale confirmar esses requisitos antes de começar."],
] as const;

export default function Home() {
  return (
    <div className="lp-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="lp-header">
        <a className="lp-brand" href="#inicio" aria-label="Integrada Neuropsicologia — início">
          <Image src="/assets/logo.png" alt="" width={38} height={38} priority unoptimized />
          <span><strong>Integrada</strong><small>Neuropsicologia</small></span>
        </a>
        <nav className="lp-nav" aria-label="Navegação da landing page">
          <a href="#para-quem">Para quem é</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#duvidas">Dúvidas</a>
        </nav>
        <a className="lp-header-cta" href={directContact} target="_blank" rel="noreferrer">Falar com a equipe</a>
      </header>

      <main>
        <section className="lp-hero" id="inicio">
          <div className="lp-hero-copy">
            <span className="lp-kicker"><i aria-hidden="true" /> On-line • Brasileiros 18+ • Brasil e exterior</span>
            <h1>Avaliação neuropsicológica <em>100% on-line para adultos.</em></h1>
            <p className="lp-hero-lede"><strong>Entenda o que está por trás das dificuldades de foco, memória, organização e relacionamento.</strong> O processo integra entrevista, histórico e procedimentos adequados à modalidade remota para compreender os impactos na vida real — com devolutiva clara e orientação.</p>
            <ul className="lp-hero-points">
              <li><span aria-hidden="true">✓</span> Atendimento individual e humanizado</li>
              <li><span aria-hidden="true">✓</span> Avaliação planejada para ser 100% on-line</li>
              <li><span aria-hidden="true">✓</span> Brasileiros com 18 anos ou mais, no Brasil e no exterior</li>
            </ul>
            <div className="lp-hero-actions">
              <a className="lp-primary-button" href={directContact} target="_blank" rel="noreferrer">Quero conversar com a equipe <span aria-hidden="true">→</span></a>
              <a className="lp-quiet-link" href="#como-funciona">Entender como funciona <span aria-hidden="true">↓</span></a>
            </div>
            <p className="lp-hero-note">Você não precisa chegar com um diagnóstico pronto. O primeiro passo é entender o que tem acontecido.</p>
          </div>

          <div className="lp-hero-panel">
            <div className="lp-hero-image">
              <Image src="/assets/hero-online.webp" alt="Pessoa adulta participando de avaliação neuropsicológica on-line em ambiente privativo" width={1200} height={630} sizes="(max-width: 900px) 200vw, 84vw" priority unoptimized />
              <div className="lp-image-badge"><strong>Mais de 15 anos</strong><span>de experiência clínica</span></div>
            </div>
            <OnlineAssessmentLeadForm placement="hero" />
          </div>
        </section>

        <section className="lp-proof" aria-label="Diferenciais do atendimento">
          <div><strong>100% on-line</strong><span>da entrevista à devolutiva</span></div>
          <div><strong>Brasileiros 18+</strong><span>no Brasil e no exterior</span></div>
          <div><strong>Em torno de 8 encontros</strong><span>planejamento individualizado</span></div>
          <div><strong>Documentação digital</strong><span>com devolutiva individual</span></div>
        </section>

        <section className="lp-signals" id="para-quem">
          <div className="lp-section-intro lp-section-intro-wide">
            <span className="lp-section-label">Talvez seja hora de investigar</span>
            <h2>Quando viver no esforço deixa de parecer “normal”.</h2>
            <p>Dificuldades pontuais fazem parte da vida. A avaliação pode ser considerada quando elas são frequentes, persistentes ou começam a causar prejuízo.</p>
          </div>
          <div className="lp-signal-grid">
            {signals.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="lp-inline-cta">
            <p><strong>Esses sinais podem ocorrer por diferentes motivos e não definem um diagnóstico.</strong> Eles mostram que pode ser útil olhar para o conjunto com mais cuidado.</p>
            <a className="lp-dark-button" href={whatsappUrl("Olá! Quero conversar sobre dificuldades de foco, memória, organização ou relacionamento e entender melhor a avaliação neuropsicológica on-line.")} target="_blank" rel="noreferrer">Conversar sobre minhas dificuldades <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="lp-topics" id="o-que-investiga" aria-labelledby="investigation-title">
          <div className="lp-section-intro lp-section-intro-wide">
            <span className="lp-section-label">O que pode ser investigado</span>
            <h2 id="investigation-title">A avaliação neuropsicológica on-line olha para o conjunto, não para um sinal isolado.</h2>
            <p>As hipóteses são consideradas em relação à história de vida, ao funcionamento cognitivo e emocional e aos prejuízos percebidos no trabalho, nos estudos, na rotina e nos relacionamentos.</p>
          </div>
          <div className="lp-topic-grid">
            {investigationTopics.map(({ title, text, href, link }) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href={href}>{link} <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
          <p className="lp-topic-note"><strong>Importante:</strong> a presença de sinais não confirma TDAH, autismo ou qualquer outra condição. A finalidade da avaliação é compreender padrões, hipóteses e necessidades de cuidado com responsabilidade.</p>
        </section>

        <section className="lp-clarity">
          <div className="lp-clarity-visual">
            <span className="lp-clarity-orbit" aria-hidden="true" />
            <span className="lp-clarity-dots" aria-hidden="true">•••••••••</span>
            <div className="lp-clarity-quote"><span>Não é um teste rápido.</span><strong>É um processo clínico que conecta história, funcionamento e vida real.</strong></div>
          </div>
          <div className="lp-clarity-copy">
            <span className="lp-section-label">O que você recebe</span>
            <h2>Mais do que um nome: clareza para decidir o próximo passo.</h2>
            <p>A avaliação não resume você a um resultado. Ela organiza informações que hoje parecem soltas e ajuda a compreender forças, dificuldades e necessidades de cuidado.</p>
            <div className="lp-benefit-list">
              {benefits.map(([title, text]) => (
                <article key={title}>
                  <span aria-hidden="true">✓</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-professional" aria-labelledby="responsavel-title">
          <div className="lp-professional-copy">
            <span className="lp-section-label">Responsabilidade profissional</span>
            <h2 id="responsavel-title">Você sabe quem responde pelo seu atendimento.</h2>
            <p>Carla atua há mais de 15 anos na Psicologia e mantém um cuidado transparente. Desde o primeiro contato, a equipe explica o alcance, os limites e as etapas da avaliação.</p>
          </div>
          <div className="lp-professional-card">
            <span className="lp-professional-mark" aria-hidden="true">CL</span>
            <div><span>Responsável técnica</span><h3>Carla Luciana da Conceição Lima</h3><p>Psicóloga • CRP 08/39739</p></div>
          </div>
          <p className="lp-professional-update">Responsabilidade técnica da Integrada Neuropsicologia. <time dateTime="2026-07-21">Conteúdo editorial atualizado em julho de 2026.</time></p>
        </section>

        <section className="lp-google-reviews" aria-labelledby="google-reviews-title">
          <div className="lp-google-reviews-copy">
            <span className="lp-section-label">Avaliações públicas</span>
            <h2 id="google-reviews-title">Consulte as experiências compartilhadas diretamente no Google.</h2>
            <p>Para preservar a privacidade de quem foi atendido, não reproduzimos relatos individuais neste site. As avaliações podem ser consultadas no perfil oficial da Integrada.</p>
          </div>
          <a className="lp-google-reviews-card" href={googleReviewsUrl} target="_blank" rel="noreferrer" aria-label="Ver as avaliações públicas da Integrada Neuropsicologia no Google Maps">
            <span className="lp-google-platform">Google Maps</span>
            <strong>Integrada Neuropsicologia</strong>
            <span>Avaliações publicadas no perfil oficial</span>
            <b>Ver avaliações no Google <i aria-hidden="true">↗</i></b>
          </a>
        </section>

        <section className="lp-process" id="como-funciona">
          <div className="lp-section-intro">
            <span className="lp-section-label">Como funciona</span>
            <h2>Um processo estruturado, adaptado à sua necessidade.</h2>
            <p>Em geral, a avaliação é organizada em torno de 8 encontros e planejada para acontecer integralmente on-line. O plano é definido conforme a demanda e o histórico apresentados.</p>
          </div>
          <ol className="lp-process-list">
            {process.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
          <aside className="lp-responsible-note">
            <span aria-hidden="true">i</span>
            <p><strong>Orientação responsável:</strong> esta avaliação on-line é indicada para pessoas com 18 anos ou mais e foi planejada para acontecer integralmente a distância. Os procedimentos e instrumentos são selecionados para a modalidade remota e para os objetivos clínicos de cada pessoa.</p>
          </aside>
        </section>

        <section className="lp-fit">
          <div className="lp-fit-copy">
            <span className="lp-section-label">Preparação para os encontros</span>
            <h2>O que você precisa para realizar a avaliação on-line?</h2>
            <p>Antes do início, a equipe orienta sobre os recursos e combina os detalhes para que todas as etapas aconteçam com privacidade e estabilidade.</p>
          </div>
          <div className="lp-fit-cards">
            <article><span aria-hidden="true">01</span><h3>Privacidade</h3><p>Um ambiente silencioso e reservado para conversar e realizar as atividades.</p></article>
            <article><span aria-hidden="true">02</span><h3>Estrutura</h3><p>Computador ou notebook, câmera e conexão estável durante os encontros.</p></article>
            <article><span aria-hidden="true">03</span><h3>Disponibilidade</h3><p>Tempo reservado para participar dos encontros e realizar as atividades com tranquilidade.</p></article>
          </div>
        </section>

        <section className="lp-contact" id="contato">
          <div className="lp-contact-copy">
            <span className="lp-section-label">Seu próximo passo</span>
            <h2>Transforme a dúvida em uma conversa clara.</h2>
            <p>Conte brevemente o que está acontecendo. A equipe explica as etapas da avaliação on-line, esclarece suas dúvidas e orienta como começar.</p>
            <ul>
              <li><span aria-hidden="true">✓</span> Sem compromisso de iniciar a avaliação</li>
              <li><span aria-hidden="true">✓</span> Brasileiros com 18 anos ou mais, no Brasil e no exterior</li>
              <li><span aria-hidden="true">✓</span> Resposta diretamente pelo WhatsApp</li>
            </ul>
          </div>
          <OnlineAssessmentLeadForm placement="section" />
        </section>

        <section className="lp-faq" id="duvidas">
          <div className="lp-section-intro">
            <span className="lp-section-label">Dúvidas frequentes</span>
            <h2>Informação para decidir com tranquilidade.</h2>
          </div>
          <div className="lp-faq-list">
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="lp-final-cta">
          <div><span>Integrada Neuropsicologia</span><h2>Compreender o que acontece pode mudar a forma como você cuida de si.</h2></div>
          <a className="lp-light-button" href={directContact} target="_blank" rel="noreferrer">Verificar disponibilidade <span aria-hidden="true">→</span></a>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-brand"><Image src="/assets/logo.png" alt="" width={38} height={38} unoptimized /><span><strong>Integrada Neuropsicologia</strong><small>Avaliando o presente, transformando o futuro.</small></span></div>
        <div><strong>Atendimento</strong><span>On-line para pessoas com 18 anos ou mais — brasileiros no Brasil e em outros países</span><span>Responsável técnica: Carla Luciana da Conceição Lima • Psicóloga • CRP 08/39739</span><a href="tel:+5541992113665">(41) 99211-3665</a></div>
        <div><strong>Endereço profissional</strong><span>Rua Jacarezinho, 1266, Mercês<br />CEP 80810-130 — Curitiba/PR</span></div>
        <p>© {new Date().getFullYear()} Integrada Neuropsicologia. O conteúdo deste site é informativo e não substitui avaliação individual.</p>
      </footer>

      <a className="lp-floating-cta" href={directContact} target="_blank" rel="noreferrer" aria-label="Conversar com a equipe pelo WhatsApp">Conversar pelo WhatsApp <span aria-hidden="true">→</span></a>
    </div>
  );
}
