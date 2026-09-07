import { LANDING_PATH } from "@/lib/seo";

export type LandingSitelinkSlug =
  | "como-funciona"
  | "para-quem"
  | "o-que-investiga"
  | "duvidas"
  | "avaliacoes"
  | "contato";

export type LandingSitelink = {
  slug: LandingSitelinkSlug;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  points: ReadonlyArray<{
    title: string;
    text: string;
  }>;
  note: string;
  adsDescriptions: readonly [string, string];
};

export const landingSitelinks: ReadonlyArray<LandingSitelink> = [
  {
    slug: "como-funciona",
    label: "Como funciona",
    eyebrow: "Processo 100% on-line",
    title: "Como funciona a avaliação neuropsicológica on-line",
    description:
      "Conheça as etapas da avaliação neuropsicológica on-line para adultos, da entrevista inicial à devolutiva profissional.",
    intro:
      "O processo é planejado desde o início para acontecer on-line, com encontros individuais, procedimentos compatíveis com a modalidade remota e integração cuidadosa das informações.",
    points: [
      { title: "Entrevista inicial", text: "Compreensão da sua história, das dificuldades atuais e dos objetivos da avaliação." },
      { title: "Planejamento individual", text: "Definição dos procedimentos e instrumentos adequados à demanda e ao formato on-line." },
      { title: "Encontros de avaliação", text: "Sessões individuais para investigar funções cognitivas, aspectos emocionais e comportamentais." },
      { title: "Análise integrada", text: "Os resultados são interpretados em conjunto; nenhum teste isolado define uma conclusão." },
      { title: "Devolutiva e documentação", text: "Explicação dos resultados, orientações e entrega da documentação correspondente ao processo." },
    ],
    note:
      "A avaliação costuma ser organizada em torno de oito encontros. A quantidade e a duração são definidas conforme a demanda individual.",
    adsDescriptions: ["Veja as etapas da avaliação", "Em torno de oito encontros"],
  },
  {
    slug: "para-quem",
    label: "Para quem é",
    eyebrow: "Adultos a partir de 18 anos",
    title: "Para quem é a avaliação neuropsicológica on-line",
    description:
      "Entenda quando adultos no Brasil ou brasileiros no exterior podem buscar uma avaliação neuropsicológica 100% on-line.",
    intro:
      "A avaliação pode ajudar quando dificuldades de atenção, memória, organização, interação social ou regulação emocional começam a afetar a rotina, o trabalho, os estudos ou os relacionamentos.",
    points: [
      { title: "Foco e atenção", text: "Quando acompanhar conversas, leituras ou reuniões exige esforço excessivo." },
      { title: "Memória", text: "Quando esquecimentos frequentes interferem em compromissos, tarefas ou decisões." },
      { title: "Organização", text: "Quando iniciar, priorizar e concluir atividades se torna difícil ou instável." },
      { title: "Relacionamentos", text: "Quando comunicação, interação social ou compreensão de contextos geram sofrimento." },
      { title: "Sobrecarga e sensibilidade", text: "Quando mudanças, estímulos sensoriais ou demandas simultâneas causam esgotamento." },
      { title: "Hipóteses ainda abertas", text: "Quando TDAH, autismo, ansiedade ou burnout parecem explicar apenas parte do que acontece." },
    ],
    note:
      "Você não precisa chegar com um diagnóstico ou encaminhamento pronto. A avaliação começa pela compreensão do que tem acontecido.",
    adsDescriptions: ["Adultos 18+ no Brasil e exterior", "Entenda quando buscar avaliação"],
  },
  {
    slug: "o-que-investiga",
    label: "O que pode investigar",
    eyebrow: "Compreensão do conjunto",
    title: "O que a avaliação pode investigar",
    description:
      "Veja as funções cognitivas, emocionais e comportamentais que podem compor uma avaliação neuropsicológica on-line para adultos.",
    intro:
      "A investigação é definida de forma individual. O objetivo não é procurar um rótulo isolado, mas compreender padrões, recursos e dificuldades no contexto da história de cada pessoa.",
    points: [
      { title: "Atenção", text: "Sustentação do foco, alternância, distração e controle da atenção." },
      { title: "Memória", text: "Aprendizagem, retenção, evocação e uso de informações no cotidiano." },
      { title: "Funções executivas", text: "Planejamento, organização, flexibilidade, inibição e tomada de decisão." },
      { title: "Linguagem e raciocínio", text: "Compreensão, expressão, velocidade de processamento e resolução de problemas." },
      { title: "Cognição social", text: "Percepção de contextos sociais, comunicação e compreensão de perspectivas." },
      { title: "Aspectos emocionais", text: "Ansiedade, humor, sobrecarga e outros fatores que podem influenciar o desempenho." },
    ],
    note:
      "Nenhum instrumento isolado confirma um diagnóstico. As conclusões dependem da integração entre entrevista, observação, procedimentos e contexto clínico.",
    adsDescriptions: ["Foco, memória e organização", "Veja as funções avaliadas"],
  },
  {
    slug: "duvidas",
    label: "Dúvidas frequentes",
    eyebrow: "Informação para decidir",
    title: "Dúvidas sobre a avaliação on-line",
    description:
      "Tire dúvidas sobre duração, requisitos, devolutiva e atendimento de brasileiros no exterior.",
    intro:
      "Estas são respostas gerais para ajudar você a compreender o processo. O planejamento específico é explicado antes do início da avaliação.",
    points: [
      { title: "Todo o processo acontece on-line?", text: "Sim. Da entrevista inicial à devolutiva e à entrega da documentação." },
      { title: "Quanto tempo dura?", text: "Em geral, o processo é organizado em torno de oito encontros, conforme a demanda." },
      { title: "O que preciso para participar?", text: "Computador ou notebook, câmera, conexão estável e ambiente silencioso e privativo." },
      { title: "Atende brasileiros no exterior?", text: "Sim. Os horários são combinados considerando o fuso de cada pessoa." },
      { title: "Receberei devolutiva?", text: "Sim. Os resultados são explicados e a documentação correspondente é entregue ao final." },
      { title: "Preciso de encaminhamento?", text: "Em geral, não. Você pode conversar diretamente com a equipe para conhecer o processo." },
    ],
    note:
      "A documentação é elaborada conforme as normas profissionais brasileiras. Para uso no exterior, confirme previamente os requisitos da instituição que a receberá.",
    adsDescriptions: ["Veja duração e requisitos", "Tire dúvidas antes de começar"],
  },
  {
    slug: "avaliacoes",
    label: "Avaliações no Google",
    eyebrow: "Fonte pública e verificável",
    title: "Experiências publicadas no Google",
    description:
      "Acesse o perfil oficial da Integrada Neuropsicologia e consulte avaliações publicadas diretamente no Google.",
    intro:
      "Para preservar o contexto e a fonte original, não reproduzimos depoimentos individuais nesta página. O perfil oficial permite consultar as experiências publicadas diretamente na plataforma.",
    points: [
      { title: "Fonte original", text: "As avaliações permanecem no ambiente em que foram publicadas." },
      { title: "Contexto preservado", text: "Você pode consultar a data, a autoria pública e o conteúdo completo no Google." },
      { title: "Privacidade responsável", text: "A Integrada não transforma relatos clínicos em peças promocionais nesta landing page." },
    ],
    note:
      "Avaliações públicas representam experiências individuais e não garantem resultados semelhantes para outras pessoas.",
    adsDescriptions: ["Consulte o perfil oficial", "Veja experiências publicadas"],
  },
  {
    slug: "contato",
    label: "Falar com a equipe",
    eyebrow: "Primeiro contato",
    title: "Converse com a equipe sobre a avaliação",
    description:
      "Entre em contato pelo WhatsApp para entender a avaliação neuropsicológica 100% on-line para adultos.",
    intro:
      "Você pode iniciar pelo formulário seguro desta página ou abrir diretamente o WhatsApp. A equipe explica o processo e orienta sobre os próximos passos.",
    points: [
      { title: "Atendimento individual", text: "A conversa inicial considera sua dúvida e o que você deseja compreender." },
      { title: "Adultos no Brasil e exterior", text: "Atendimento para brasileiros com 18 anos ou mais, inclusive em outros países." },
      { title: "Sem diagnóstico pronto", text: "Você não precisa ter uma hipótese confirmada para fazer o primeiro contato." },
    ],
    note:
      "Não envie exames ou documentos no primeiro contato. O conteúdo preenchido apenas prepara a mensagem que você revisará no WhatsApp.",
    adsDescriptions: ["Atendimento pelo WhatsApp", "Converse antes de começar"],
  },
] as const;

export const landingSitelinkSlugs = landingSitelinks.map(({ slug }) => slug);

export function getLandingSitelink(slug: string) {
  return landingSitelinks.find((item) => item.slug === slug);
}

export function landingSitelinkPath(slug: LandingSitelinkSlug) {
  return `${LANDING_PATH}/${slug}`;
}
