export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  intro: string;
  sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "tdah-ansiedade-ou-burnout-como-diferenciar-em-adultos",
    title: "TDAH, ansiedade ou burnout: como diferenciar em adultos?",
    excerpt: "Entenda por que esses quadros podem se parecer e como uma avaliação cuidadosa direciona o tratamento.",
    category: "TDAH",
    date: "25 de maio de 2026",
    readTime: "5 min de leitura",
    intro: "Desatenção, cansaço, irritabilidade e dificuldade para concluir tarefas podem aparecer em situações diferentes. O ponto central não é encaixar um sintoma em um rótulo, mas compreender quando ele começou, em quais contextos aparece e como afeta a vida.",
    sections: [
      { title: "O que pode confundir", paragraphs: ["No TDAH, os padrões de desatenção e desorganização costumam acompanhar a pessoa ao longo da vida, ainda que mudem de forma. Na ansiedade, a mente pode ficar ocupada por preocupações e antecipações. No burnout, a queda de funcionamento aparece ligada a uma sobrecarga prolongada."] },
      { title: "Perguntas que ajudam na investigação", paragraphs: ["Uma boa avaliação organiza a história completa e evita conclusões baseadas apenas no momento atual."], bullets: ["Os sinais já existiam na infância ou surgiram recentemente?", "A dificuldade aparece em vários ambientes ou principalmente no trabalho?", "Descanso e afastamento da sobrecarga mudam o quadro?", "Há ansiedade, depressão, alterações de sono ou outras condições associadas?"] },
      { title: "Por que a avaliação muda o cuidado", paragraphs: ["Quadros parecidos podem pedir estratégias diferentes. Ao integrar entrevistas, escalas, testes e impacto funcional, a avaliação ajuda a definir prioridades e próximos passos com mais segurança."] },
    ],
  },
  {
    slug: "quanto-custa-uma-avaliação-neuropsicológica",
    title: "Quanto custa uma avaliação neuropsicológica?",
    excerpt: "Veja o que compõe um processo completo e por que comparar apenas preço pode esconder diferenças importantes.",
    category: "Avaliação",
    date: "25 de maio de 2026",
    readTime: "4 min de leitura",
    intro: "O valor de uma avaliação depende da complexidade da demanda, da faixa etária, do número de encontros e dos instrumentos necessários. Mais importante do que buscar um número isolado é entender o que está incluído no processo.",
    sections: [
      { title: "O que normalmente compõe o investimento", paragraphs: ["Uma avaliação completa envolve muito mais do que aplicar testes. Há tempo clínico antes, durante e depois dos encontros."], bullets: ["Entrevista e análise do histórico", "Planejamento individual da bateria", "Aplicação e correção de instrumentos", "Integração dos resultados", "Devolutiva e elaboração do laudo", "Orientações e encaminhamentos"] },
      { title: "Por que os valores variam", paragraphs: ["Demandas diferentes exigem combinações diferentes de instrumentos, contatos com escola ou profissionais e níveis distintos de análise. O orçamento deve deixar claro o escopo e o que acontece em cada etapa."] },
      { title: "O que perguntar antes de contratar", paragraphs: ["Pergunte quantos encontros estão previstos, se o laudo e a devolutiva estão incluídos, qual é a experiência da equipe com a sua demanda e como será feita a comunicação de resultados."] },
    ],
  },
  {
    slug: "sinal-da-necessidade-de-avaliação-neuropsicológica",
    title: "TDAH em crianças: quais sinais de alerta merecem atenção?",
    excerpt: "Saiba quando dificuldades de atenção e comportamento indicam a necessidade de uma investigação mais cuidadosa.",
    category: "Infância",
    date: "15 de outubro de 2024",
    readTime: "5 min de leitura",
    intro: "Toda criança pode se distrair, se agitar ou resistir a uma tarefa. A atenção aumenta quando esses comportamentos são frequentes, persistem ao longo do tempo e causam prejuízo em mais de um ambiente.",
    sections: [
      { title: "Sinais que costumam aparecer", paragraphs: ["A observação deve considerar idade, contexto e intensidade."], bullets: ["Dificuldade para manter atenção em tarefas adequadas à idade", "Esquecimentos e perda frequente de materiais", "Necessidade constante de lembretes", "Impulsividade ou dificuldade para esperar", "Prejuízo acadêmico, social ou familiar"] },
      { title: "O que mais pode parecer TDAH", paragraphs: ["Sono insuficiente, ansiedade, dificuldades de aprendizagem, problemas de visão ou audição, situações familiares e outras condições também podem afetar atenção e comportamento. Por isso, investigar é diferente de apenas aplicar um teste rápido."] },
      { title: "Como a família pode começar", paragraphs: ["Registre situações concretas, converse com a escola e procure uma avaliação quando o padrão for persistente. Informação organizada ajuda o profissional a compreender melhor o funcionamento da criança."] },
    ],
  },
  {
    slug: "avaliação-neuropsicológica-x-avaliação-neurológica-qual-é-a-diferença",
    title: "Avaliação neuropsicológica x avaliação neurológica: qual é a diferença?",
    excerpt: "Entenda como as duas áreas se complementam na investigação de sintomas cognitivos e comportamentais.",
    category: "Orientação",
    date: "19 de outubro de 2024",
    readTime: "4 min de leitura",
    intro: "Os nomes são parecidos, mas os objetivos e métodos são diferentes. Em muitos casos, neurologia e neuropsicologia trabalham juntas para ampliar a compreensão do quadro.",
    sections: [
      { title: "Avaliação neurológica", paragraphs: ["É conduzida por médico neurologista e investiga o funcionamento do sistema nervoso a partir da história clínica, exame físico e, quando necessário, exames complementares."] },
      { title: "Avaliação neuropsicológica", paragraphs: ["É um processo clínico que examina atenção, memória, linguagem, raciocínio, funções executivas e aspectos emocionais por meio de entrevistas, tarefas e instrumentos padronizados."] },
      { title: "Quando elas se complementam", paragraphs: ["Uma pessoa pode chegar à neuropsicologia por encaminhamento médico ou levar o laudo neuropsicológico para apoiar a investigação neurológica. A integração reduz lacunas e favorece decisões mais bem informadas."] },
    ],
  },
  {
    slug: "não-é-só-inteligência-o-que-você-precisa-saber-sobre-altas-habilidades-superdotação",
    title: "Não é só inteligência: o que saber sobre altas habilidades e superdotação",
    excerpt: "Potencial elevado pode aparecer de formas diferentes e também vir acompanhado de necessidades específicas.",
    category: "Desenvolvimento",
    date: "9 de junho de 2025",
    readTime: "5 min de leitura",
    intro: "Altas habilidades não significam desempenho perfeito em tudo. O perfil pode envolver raciocínio, criatividade, liderança, áreas acadêmicas ou talentos específicos, com ritmos diferentes entre desenvolvimento intelectual e emocional.",
    sections: [
      { title: "Sinais possíveis", paragraphs: ["Nenhuma lista isolada confirma o perfil, mas alguns padrões podem chamar atenção."], bullets: ["Aprendizagem rápida em áreas de interesse", "Curiosidade intensa e perguntas complexas", "Vocabulário ou raciocínio avançado para a idade", "Criatividade e soluções pouco convencionais", "Sensibilidade, perfeccionismo ou frustração com tarefas repetitivas"] },
      { title: "Por que também pode haver dificuldade", paragraphs: ["Uma criança pode apresentar alto potencial e, ao mesmo tempo, TDAH, TEA, dificuldades de aprendizagem ou sofrimento emocional. Essa combinação é chamada, em alguns contextos, de dupla excepcionalidade e pede um olhar integrado."] },
      { title: "O papel da avaliação", paragraphs: ["A avaliação ajuda a mapear forças, necessidades e condições associadas, oferecendo informações para família e escola criarem desafios adequados sem ignorar o bem-estar."] },
    ],
  },
  {
    slug: "como-é-feito-o-diagnóstico-de-tdah-em-crianças-uma-abordagem-multidisciplinar",
    title: "Como é feito o diagnóstico de TDAH em crianças?",
    excerpt: "Conheça uma abordagem multidisciplinar que integra desenvolvimento, escola, família e funcionamento cotidiano.",
    category: "TDAH",
    date: "6 de novembro de 2024",
    readTime: "6 min de leitura",
    intro: "O diagnóstico de TDAH não depende de um único teste. Ele é construído a partir da história da criança, dos sintomas em diferentes ambientes, do impacto na rotina e da exclusão de explicações alternativas.",
    sections: [
      { title: "Informações de mais de um contexto", paragraphs: ["Família e escola observam situações diferentes. Entrevistas e escalas ajudam a comparar esses contextos e entender se o padrão é persistente."] },
      { title: "O que a avaliação pode investigar", paragraphs: ["Atenção, controle inibitório, memória de trabalho, velocidade de processamento, aprendizagem e aspectos emocionais podem ser examinados conforme a necessidade."], bullets: ["Histórico do desenvolvimento", "Rotina de sono e saúde", "Desempenho acadêmico", "Relacionamentos e autorregulação", "Possíveis condições associadas"] },
      { title: "Uma decisão integrada", paragraphs: ["O diagnóstico clínico considera o conjunto de evidências. O laudo neuropsicológico pode contribuir com esse processo e oferecer recomendações para casa, escola e acompanhamento profissional."] },
    ],
  },
];

export const blogPostBySlug = Object.fromEntries(blogPosts.map((post) => [post.slug, post])) as Record<string, BlogPost>;
