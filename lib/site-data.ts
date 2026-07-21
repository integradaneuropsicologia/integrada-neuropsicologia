export const whatsappNumber = "5541992113665";

export const whatsappUrl = (message = "Olá. Gostaria de saber mais sobre seus serviços!") =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export type ServicePageData = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  cta: string;
  image: string;
  imageAlt: string;
  whyTitle: string;
  highlights: Array<{ title: string; text: string }>;
  signsTitle: string;
  signsIntro: string;
  signs: string[];
  processTitle: string;
  process: Array<{ title: string; text: string }>;
  closingTitle: string;
  closingText: string;
};

export const servicePages: Record<string, ServicePageData> = {
  avaliacaoinfantil: {
    slug: "avaliacaoinfantil",
    eyebrow: "Avaliação neuropsicológica infantil",
    title: "Diagnóstico infantil, profissional e humanizado.",
    intro:
      "Se a escola ou o médico solicitaram uma avaliação com laudo, você precisa de precisão e agilidade. Aqui são 10 sessões, visita à escola, integração com professores e um plano de ação claro para seu filho.",
    cta: "Quero orientação para meu filho",
    image: "/assets/infantojuvenil.avif",
    imageAlt: "Criança em atividade de aprendizagem",
    whyTitle: "Por que a Integrada Neuropsicologia?",
    highlights: [
      { title: "Mais de 15 anos de experiência", text: "Atendimento técnico e humanizado, com olhar clínico e escolar." },
      { title: "Bateria planejada para a demanda", text: "Procedimentos e instrumentos selecionados conforme a idade e os objetivos da avaliação." },
      { title: "Laudo claro e aplicável", text: "Recomendações práticas para casa, escola e rede de cuidado." },
      { title: "Visita à escola", text: "Contato com professores e observação da rotina para entender o contexto real." },
    ],
    signsTitle: "Seu filho está com alguma dessas dificuldades?",
    signsIntro: "Quanto antes a causa é compreendida, mais rápido o cuidado pode ser direcionado.",
    signs: [
      "Dificuldades persistentes na escola e nas tarefas.",
      "Problemas de socialização ou conflitos com colegas.",
      "Déficit de atenção, foco e organização.",
      "Comportamentos repetitivos, hiperatividade ou impulsividade.",
    ],
    processTitle: "Como funciona o nosso processo (10 sessões)",
    process: [
      { title: "1. Entrevista inicial", text: "Anamnese detalhada com os responsáveis para mapear queixas e histórico." },
      { title: "2. Planejamento da bateria", text: "Selecionamos testes adequados ao perfil e à idade." },
      { title: "3–8. Aplicações", text: "Sessões lúdicas e objetivas para avaliar cognição e aspectos socioemocionais." },
      { title: "9. Visita à escola", text: "Contato com professores e observação em rotina." },
      { title: "10. Devolutiva + laudo", text: "Resultados explicados com clareza e plano de ação para casa e escola." },
    ],
    closingTitle: "Quer clareza sobre o que está acontecendo?",
    closingText: "A gente avalia o presente para transformar o futuro — sem achismos, com ciência e prática.",
  },
  avaliacaoneuropsicologicaadulto: {
    slug: "avaliacaoneuropsicologicaadulto",
    eyebrow: "Avaliação neuropsicológica adulta",
    title: "Quando memória, foco e organização começam a cobrar a conta.",
    intro:
      "Fazemos 8 sessões com bateria completa e laudo claro para estudo, trabalho e vida. Medir o que está acontecendo permite agir com precisão.",
    cta: "Quero entender o meu caso",
    image: "/assets/adulto.avif",
    imageAlt: "Adulto durante avaliação clínica",
    whyTitle: "Por que realizar sua avaliação na Integrada?",
    highlights: [
      { title: "Experiência ao longo da vida", text: "Avaliação e orientação para cada fase, da juventude à vida adulta." },
      { title: "Bateria completa e padronizada", text: "Entrevistas, escalas, tarefas cognitivas e observação clínica." },
      { title: "Laudo que vira estratégia", text: "Recomendações para rotina, estudo e trabalho — sem jargão vazio." },
      { title: "Integração com a rede", text: "Encaminhamentos e diálogo com outros profissionais quando necessário." },
    ],
    signsTitle: "Se isso soa familiar, a avaliação pode ajudar",
    signsIntro: "Uma investigação estruturada ajuda a organizar as hipóteses e a orientar os próximos passos.",
    signs: [
      "Atraso em prazos, pilhas de tarefas e apagões de memória.",
      "Procrastinação, impulsividade e desorganização crônica.",
      "Queda de produtividade e conflito com a própria autoestima.",
      "Dúvida entre TDAH, ansiedade, burnout ou outros quadros.",
    ],
    processTitle: "Processo em 8 sessões",
    process: [
      { title: "1. Entrevista clínica", text: "Histórico de vida e demandas atuais de trabalho e relacionamentos." },
      { title: "2. Bateria dirigida", text: "Testes escolhidos de acordo com as hipóteses e necessidades." },
      { title: "3–6. Aplicações", text: "Avaliação das funções cognitivas e possíveis comorbidades." },
      { title: "7. Integração", text: "Síntese dos dados e análise do impacto funcional." },
      { title: "8. Devolutiva + laudo", text: "Estratégias práticas e encaminhamentos quando necessários." },
    ],
    closingTitle: "Bora colocar a vida nos trilhos?",
    closingText: "Avaliamos o presente para transformar o futuro — com ciência e estratégia.",
  },
  avaliacaoonline: {
    slug: "avaliacaoonline",
    eyebrow: "Avaliação neuropsicológica on-line",
    title: "On-line de verdade: prática, segura e sem deslocamento.",
    intro:
      "São 8 sessões com testes remotos adequados, sigilo e laudo digital com orientações para rotina, estudo e produtividade.",
    cta: "Quero avaliar sem sair de casa",
    image: "/assets/online.avif",
    imageAlt: "Atendimento neuropsicológico on-line",
    whyTitle: "Por que o on-line funciona aqui?",
    highlights: [
      { title: "Metodologia remota", text: "Instrumentos e protocolos adequados à aplicação on-line." },
      { title: "Laudo digital assinado", text: "Documento válido, linguagem clara e plano de ação." },
      { title: "Foco em resultados", text: "Rotina, estudo, trabalho e saúde mental alinhados." },
      { title: "Orientações médicas", text: "Encaminhamentos para psiquiatria ou neurologia quando necessários." },
    ],
    signsTitle: "O que você precisa para participar",
    signsIntro: "O formato corta deslocamentos sem abrir mão do rigor técnico.",
    signs: [
      "Conexão estável de internet e câmera.",
      "Ambiente silencioso e sem interrupções.",
      "Notebook, computador ou tablet; fones podem ajudar.",
      "Documento de identidade para conferência.",
    ],
    processTitle: "Processo em 8 sessões",
    process: [
      { title: "1. Entrevista por vídeo", text: "Mapeamento de queixas, rotina e histórico." },
      { title: "2. Preparação técnica", text: "Checagem de equipamentos e consentimento." },
      { title: "3–6. Testes remotos", text: "Bateria adequada ao formato on-line." },
      { title: "7. Integração", text: "Síntese clínica e análise do impacto funcional." },
      { title: "8. Devolutiva + laudo digital", text: "Plano prático e encaminhamentos, se preciso." },
    ],
    closingTitle: "Praticidade sem abrir mão de qualidade.",
    closingText: "Diagnóstico claro, 100% on-line, com plano de ação real.",
  },
  avaliacaotdah: {
    slug: "avaliacaotdah",
    eyebrow: "Avaliação de TDAH",
    title: "Investigação cuidadosa de TDAH para adultos e crianças.",
    intro:
      "Foco, tempo e vida voltando ao eixo. Avaliação com laudo em 8 sessões, visita à escola quando infantil e devolutiva objetiva com plano de ação.",
    cta: "Quero investigar TDAH",
    image: "/assets/adulto.avif",
    imageAlt: "Pessoa organizando atividades durante uma avaliação",
    whyTitle: "Por que avaliar TDAH aqui?",
    highlights: [
      { title: "Experiência clínica", text: "Mais de 15 anos acompanhando diferentes demandas ao longo da vida." },
      { title: "Bateria completa", text: "Atenção, funções executivas, memória, linguagem e rastreios emocionais." },
      { title: "Laudo que vira ação", text: "Recomendações práticas para estudo, rotina e produtividade." },
      { title: "Integração com a rede", text: "Escola e psiquiatria incluídas quando necessário." },
    ],
    signsTitle: "Sinais de TDAH: o que observar",
    signsIntro: "Os sinais precisam ser analisados no contexto e em diferentes fases da vida.",
    signs: [
      "Desatenção e esquecimentos frequentes.",
      "Dificuldade para começar ou concluir tarefas.",
      "Impulsividade, inquietação ou hiperatividade.",
      "Impacto na escola, no trabalho ou nos relacionamentos.",
    ],
    processTitle: "Uma avaliação que olha o todo",
    process: [
      { title: "Entrevista", text: "Histórico desde a infância e impacto atual." },
      { title: "Testes", text: "Bateria cognitiva e escalas validadas." },
      { title: "Contexto", text: "Informações da família, escola ou rede quando relevantes." },
      { title: "Devolutiva", text: "Laudo claro, estratégias e encaminhamentos." },
    ],
    closingTitle: "Entenda o quadro. Escolha o cuidado certo.",
    closingText: "Uma conversa inicial ajuda a definir o melhor caminho para você ou seu filho.",
  },
  avaliacaoautismo: {
    slug: "avaliacaoautismo",
    eyebrow: "Avaliação de autismo (TEA)",
    title: "Investigação especializada para crianças e adultos.",
    intro:
      "Avaliamos comunicação, interação social, flexibilidade e aspectos sensoriais, diferenciando TEA de outras condições. São 8 sessões e laudo claro com recomendações práticas.",
    cta: "Quero investigar TEA",
    image: "/assets/infantojuvenil.avif",
    imageAlt: "Momento de vínculo e aprendizagem",
    whyTitle: "Por que avaliar TEA na Integrada?",
    highlights: [
      { title: "Experiência ao longo da vida", text: "Avaliação e orientação na infância, adolescência e vida adulta." },
      { title: "Bateria completa", text: "Entrevistas, escalas, tarefas cognitivas e observação clínica." },
      { title: "Laudo que vira estratégia", text: "Recomendações para casa, escola e trabalho." },
      { title: "Integração com escola e rede", text: "Contato escolar e encaminhamentos quando necessários." },
    ],
    signsTitle: "Sinais de TEA: o que observar",
    signsIntro: "Nenhum sinal isolado confirma um diagnóstico. A avaliação integra história, contexto e funcionamento.",
    signs: [
      "Dificuldades persistentes na comunicação e interação social.",
      "Necessidade intensa de rotina ou sofrimento com mudanças.",
      "Interesses muito específicos e padrões repetitivos.",
      "Sensibilidades a sons, luzes, texturas ou outros estímulos.",
    ],
    processTitle: "Como acontece a investigação",
    process: [
      { title: "Entrevista clínica", text: "História do desenvolvimento e demandas atuais." },
      { title: "Protocolos específicos", text: "Instrumentos definidos conforme idade e perfil." },
      { title: "Integração de informações", text: "Dados da família, escola e outros profissionais." },
      { title: "Devolutiva + laudo", text: "Compreensão clara e próximos passos possíveis." },
    ],
    closingTitle: "Clareza para agir agora.",
    closingText: "O diagnóstico não resume a pessoa; ele pode abrir caminhos para suporte e qualidade de vida.",
  },
  avaliacaoneuropsicologicaidoso: {
    slug: "avaliacaoneuropsicologicaidoso",
    eyebrow: "Avaliação neuropsicológica do idoso",
    title: "Cuide de quem cuidou de você.",
    intro:
      "Esquecimentos, mudanças de humor ou dificuldades nas tarefas do dia a dia merecem atenção. Fazemos 8 sessões, orientação à família e laudo claro para decisões seguras.",
    cta: "Quero orientação para minha família",
    image: "/assets/idoso.avif",
    imageAlt: "Pessoa idosa em atendimento acolhedor",
    whyTitle: "Diferenciais para quem faz a avaliação",
    highlights: [
      { title: "Envelhecimento saudável", text: "Experiência em queixas leves e síndromes demenciais." },
      { title: "Bateria específica", text: "Atenção, memória, linguagem, funções executivas e funcionalidade." },
      { title: "Laudo útil à família", text: "Recomendações para segurança, rotina e estimulação cognitiva." },
      { title: "Integração médica", text: "Alinhamento com neurologia e geriatria quando indicado." },
    ],
    signsTitle: "Quando procurar uma avaliação",
    signsIntro: "Mudanças recentes ou progressivas devem ser analisadas com cuidado.",
    signs: [
      "Esquecimentos que interferem na rotina.",
      "Dificuldade com finanças, medicação ou tarefas habituais.",
      "Mudanças de comportamento, humor ou autonomia.",
      "Avaliação pré-operatória ou acompanhamento cognitivo.",
    ],
    processTitle: "Processo em 8 sessões",
    process: [
      { title: "Entrevista com paciente e família", text: "Histórico de saúde e mudanças percebidas." },
      { title: "Avaliação cognitiva", text: "Testes selecionados de acordo com a demanda." },
      { title: "Análise funcional", text: "Como as alterações impactam o cotidiano." },
      { title: "Devolutiva + laudo", text: "Orientações à família e integração com a equipe médica." },
    ],
    closingTitle: "Decisões mais seguras começam com informação.",
    closingText: "Converse com a equipe e entenda se este é o momento indicado para avaliar.",
  },
  terapiaparaadultos: {
    slug: "terapiaparaadultos",
    eyebrow: "Psicoterapia cognitivo-comportamental",
    title: "Terapia on-line para adultos com TDAH ou TEA.",
    intro:
      "Chega de se virar sozinho. TCC direta ao ponto: acolhimento, estrutura e ferramentas que cabem na vida real — sem sair de casa.",
    cta: "Quero começar meu cuidado",
    image: "/assets/psicoterapia.avif",
    imageAlt: "Sessão de psicoterapia",
    whyTitle: "Para quem é e como funciona",
    highlights: [
      { title: "Acolhimento sem julgamento", text: "Um espaço seguro para compreender padrões e construir mudanças." },
      { title: "Metas claras", text: "Objetivos definidos em conjunto e revisados ao longo do processo." },
      { title: "Estratégias para a rotina", text: "Ferramentas simples para situações reais de trabalho e relacionamentos." },
      { title: "Atendimento on-line", text: "Sessões com privacidade e praticidade, onde você estiver." },
    ],
    signsTitle: "A terapia pode ajudar quando você vive",
    signsIntro: "Entender o quadro reduz culpa, melhora a adaptação e acelera o progresso.",
    signs: [
      "Hiperfoco, procrastinação ou desorganização.",
      "Sobrecarga social, emocional ou sensorial.",
      "Dificuldades no trabalho e nos relacionamentos.",
      "Desejo de construir uma rotina possível e sustentável.",
    ],
    processTitle: "O que trabalhamos na prática",
    process: [
      { title: "Psicoeducação", text: "Compreender o funcionamento e reconhecer padrões." },
      { title: "Organização", text: "Rotinas, prioridades e estratégias executivas." },
      { title: "Regulação emocional", text: "Manejo de ansiedade, culpa, frustração e sobrecarga." },
      { title: "Autonomia", text: "Ferramentas que continuam úteis fora da sessão." },
    ],
    closingTitle: "Você não precisa fazer tudo sozinho.",
    closingText: "Uma primeira conversa ajuda a entender suas necessidades e objetivos.",
  },
  terapiaparaadultoscomautismo: {
    slug: "terapiaparaadultoscomautismo",
    eyebrow: "Terapia on-line para adultos autistas",
    title: "TEA na vida adulta: sem máscaras e sem rodeios.",
    intro:
      "Você não precisa se encaixar para merecer cuidado. Respeitamos seu jeito e construímos ferramentas para relações, trabalho e rotina com menos desgaste.",
    cta: "Quero uma terapia que me respeite",
    image: "/assets/psicoterapia.avif",
    imageAlt: "Acolhimento em psicoterapia on-line",
    whyTitle: "O foco da terapia",
    highlights: [
      { title: "Habilidades sociais", text: "Comunicação direta, negociação de limites e leitura de contextos sem scripts engessados." },
      { title: "Manejo sensorial", text: "Mapeamento de gatilhos, regulação e adaptações realistas." },
      { title: "Flexibilidade cognitiva", text: "Rotinas firmes, porém ajustáveis, sem culpa quando o plano muda." },
      { title: "Burnout autístico", text: "Sinais de alerta, recuperação e prevenção da sobrecarga." },
    ],
    signsTitle: "Como funciona",
    signsIntro: "Atendimento individual, respeitoso e alinhado ao seu ritmo.",
    signs: [
      "Sessões on-line de aproximadamente 50 minutos.",
      "TCC, psicoeducação e treino de habilidades.",
      "Ajustes ambientais e estratégias de autorregulação.",
      "Planos práticos para casa, relações e trabalho.",
    ],
    processTitle: "Um processo construído com você",
    process: [
      { title: "Mapeamento", text: "Necessidades, valores e situações que geram mais desgaste." },
      { title: "Prioridades", text: "Metas possíveis e significativas para o momento atual." },
      { title: "Experimentação", text: "Estratégias testadas e ajustadas na vida real." },
      { title: "Autonomia", text: "Recursos para reconhecer limites e fazer escolhas sustentáveis." },
    ],
    closingTitle: "Cuidado que respeita o seu funcionamento.",
    closingText: "Fale com a clínica e descubra se esta abordagem combina com você.",
  },
  terapiaparaadultoscomtdah: {
    slug: "terapiaparaadultoscomtdah",
    eyebrow: "Terapia on-line para adultos com TDAH",
    title: "TDAH na vida adulta? On-line, direto e com método.",
    intro:
      "Não é falta de força de vontade. É falta de sistema. A gente constrói o seu — simples, possível e constante.",
    cta: "Quero construir meu sistema",
    image: "/assets/adulto.avif",
    imageAlt: "Planejamento e rotina para adultos com TDAH",
    whyTitle: "Módulos práticos para a vida real",
    highlights: [
      { title: "Organização 360", text: "Listas enxutas, calendário realista e menos sobrecarga mental." },
      { title: "Foco e energia", text: "Sono, estímulos, micro-hábitos e manejo do hiperfoco." },
      { title: "Sistema anti-procrastinação", text: "Timeboxing, passos mínimos e pactos de responsabilidade." },
      { title: "Regulação emocional", text: "Estratégias de TCC para ansiedade, culpa e frustração." },
    ],
    signsTitle: "Para quem busca estrutura sem rigidez",
    signsIntro: "O objetivo é construir um sistema que funcione com o seu cérebro.",
    signs: [
      "Você sabe o que precisa fazer, mas não consegue começar.",
      "Compromissos, prazos e objetos somem da rotina.",
      "O hiperfoco consome energia e bagunça prioridades.",
      "A desorganização afeta autoestima e relacionamentos.",
    ],
    processTitle: "Como trabalhamos",
    process: [
      { title: "Diagnóstico funcional", text: "Quais situações travam você hoje." },
      { title: "Sistema mínimo", text: "Poucas ferramentas, escolhidas para sua realidade." },
      { title: "Ajustes semanais", text: "O que funcionou, o que não funcionou e por quê." },
      { title: "Manutenção", text: "Estratégias para retomar sem culpa quando a rotina sair do eixo." },
    ],
    closingTitle: "Menos culpa. Mais método.",
    closingText: "Comece com uma conversa sobre seus desafios e objetivos.",
  },
  terapiafasedavida: {
    slug: "terapiafasedavida",
    eyebrow: "Terapia para crianças e adolescentes",
    title: "Apoio emocional que fala a língua deles.",
    intro:
      "Não é manha. É desafio real. A gente acolhe, ensina habilidades e integra família e escola para o progresso acontecer.",
    cta: "Quero conversar sobre meu filho",
    image: "/assets/infantojuvenil.avif",
    imageAlt: "Criança em ambiente acolhedor",
    whyTitle: "Por que fazer terapia?",
    highlights: [
      { title: "Suporte certo, na fase certa", text: "Acolhimento para mudanças, conflitos, lutos e transições." },
      { title: "Regulação emocional", text: "Reconhecer emoções e encontrar formas seguras de expressá-las." },
      { title: "Habilidades sociais", text: "Comunicação, resolução de conflitos e vínculos mais saudáveis." },
      { title: "Integração família–escola", text: "Orientações alinhadas para que o progresso continue fora da sessão." },
    ],
    signsTitle: "Quando buscar ajuda?",
    signsIntro: "Mudanças persistentes de comportamento ou sofrimento merecem atenção.",
    signs: [
      "Crises, agressividade, impulsividade ou tristeza constantes.",
      "Dificuldade de atenção, organização e tarefas escolares.",
      "Problemas de socialização, bullying ou isolamento.",
      "Ansiedade, medos, baixa autoestima ou dificuldades de aprendizagem.",
    ],
    processTitle: "Cuidado conectado ao cotidiano",
    process: [
      { title: "Escuta da família", text: "Queixas, histórico e objetivos do cuidado." },
      { title: "Vínculo com a criança", text: "Recursos adequados à idade e ao jeito de cada pessoa." },
      { title: "Treino de habilidades", text: "Estratégias emocionais, sociais e de organização." },
      { title: "Orientação", text: "Devolutivas e alinhamento com família e escola quando necessário." },
    ],
    closingTitle: "A fase passa. O aprendizado fica.",
    closingText: "Converse com a equipe para entender o suporte mais adequado.",
  },
};

export const evaluationNav = [
  ["Avaliação infantil", "/avaliacaoinfantil"],
  ["Avaliação adulta", "/avaliacaoneuropsicologicaadulto"],
  ["Avaliação on-line", "/avaliacaoonline"],
  ["Avaliação TDAH", "/avaliacaotdah"],
  ["Avaliação TEA", "/avaliacaoautismo"],
  ["Avaliação do idoso", "/avaliacaoneuropsicologicaidoso"],
] as const;

export const therapyNav = [
  ["Terapia para adultos", "/terapiaparaadultos"],
  ["Adultos com autismo", "/terapiaparaadultoscomautismo"],
  ["Adultos com TDAH", "/terapiaparaadultoscomtdah"],
  ["Jovens e adolescentes", "/terapiafasedavida"],
] as const;

export const testNav = [
  ["TDAH em adultos", "/testetdahadulto"],
  ["Autismo em adultos", "/teste-autismo-adulto"],
  ["TDAH em crianças", "/teste-tdah-infantil"],
  ["Autismo em crianças", "/teste-autismo-infantil"],
] as const;

export type Screening = {
  title: string;
  description: string;
  audience: string;
  questions: string[];
};

export const screenings: Record<string, Screening> = {
  testetdahadulto: {
    title: "Checklist de sinais de TDAH em adultos",
    description: "Reflita sobre situações dos últimos seis meses. Este conteúdo educativo não calcula resultado clínico e não substitui avaliação profissional.",
    audience: "Adultos",
    questions: [
      "Com que frequência você deixa detalhes passar ou comete erros por desatenção?",
      "Com que frequência é difícil manter a atenção em tarefas ou conversas?",
      "Com que frequência você adia tarefas que exigem esforço mental prolongado?",
      "Com que frequência perde objetos necessários para a rotina?",
      "Com que frequência se distrai com estímulos ao redor ou pensamentos?",
      "Com que frequência se sente inquieto ou age antes de pensar?",
    ],
  },
  "teste-autismo-adulto": {
    title: "Checklist de sinais de autismo em adultos",
    description: "Reflita sobre situações que podem aparecer na vida adulta. Este conteúdo não confirma nem exclui diagnóstico.",
    audience: "Adultos",
    questions: [
      "Situações sociais exigem muito esforço consciente para você?",
      "Você prefere rotinas previsíveis e sente desconforto com mudanças inesperadas?",
      "Costuma perceber sons, luzes, cheiros ou texturas de forma muito intensa?",
      "Seus interesses podem se tornar muito intensos ou específicos?",
      "É difícil perceber ironia, indiretas ou regras sociais implícitas?",
      "Depois de interações sociais, você precisa de bastante tempo para se recuperar?",
    ],
  },
  "teste-tdah-infantil": {
    title: "Checklist de sinais de TDAH em crianças",
    description: "Observe comportamentos frequentes em mais de um ambiente. Este conteúdo educativo não gera diagnóstico nem substitui avaliação clínica.",
    audience: "Responsáveis por crianças",
    questions: [
      "A criança tem dificuldade para manter atenção em brincadeiras ou tarefas?",
      "Parece não escutar quando falam diretamente com ela?",
      "Tem dificuldade para organizar materiais e atividades?",
      "Perde objetos com frequência ou esquece tarefas do dia a dia?",
      "Levanta-se ou se movimenta quando deveria permanecer sentada?",
      "Interrompe, responde antes da pergunta terminar ou tem dificuldade para esperar?",
    ],
  },
  "teste-autismo-infantil": {
    title: "Checklist de sinais de autismo em crianças",
    description: "Observe comportamentos no desenvolvimento e na rotina. Este conteúdo educativo não gera diagnóstico nem substitui avaliação clínica.",
    audience: "Responsáveis por crianças",
    questions: [
      "A criança apresenta pouco interesse em compartilhar descobertas ou brincadeiras?",
      "Tem dificuldade com mudanças de rotina ou transições?",
      "Repete movimentos, sons ou brincadeiras de forma intensa?",
      "Apresenta reações marcantes a sons, texturas, luzes ou cheiros?",
      "Tem dificuldade para iniciar ou sustentar interação com outras crianças?",
      "Possui interesses muito específicos para a idade?",
    ],
  },
};
