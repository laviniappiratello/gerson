export type LunarPhase = 'nova' | 'crescente' | 'cheia' | 'minguante';

export type LunarPhaseInfo = {
  phase: LunarPhase;
  name: string;
  emoji: string;
  description: string;
  illumination: string;
  nextPhase: LunarPhase;
  nextPhaseDate: string;
  characteristics: string[];
};

export type Ritual = {
  id: string;
  title: string;
  description: string;
  phase: LunarPhase;
  duration: string;
  difficulty: 'fácil' | 'moderado' | 'avançado';
  category: string;
  materials: string[];
  steps: RitualStep[];
  suggestedCards?: number[];
  benefits: string[];
  affirmation?: string;
  music?: string;
};

export type RitualStep = {
  order: number;
  title: string;
  description: string;
  duration?: string;
};

// Info sobre fases lunares
export const LUNAR_PHASES: Record<LunarPhase, LunarPhaseInfo> = {
  nova: {
    phase: 'nova',
    name: 'Lua Nova',
    emoji: '🌑',
    description: 'Fase de novos começos, renovação e intenções',
    illumination: '0%',
    nextPhase: 'crescente',
    nextPhaseDate: '2026-05-25',
    characteristics: [
      'Novos começos',
      'Intenções e desejos',
      'Planejamento',
      'Renovação',
      'Mistério e introspecção',
    ],
  },
  crescente: {
    phase: 'crescente',
    name: 'Lua Crescente',
    emoji: '🌒',
    description: 'Fase de crescimento, atração e manifestação',
    illumination: '25-75%',
    nextPhase: 'cheia',
    nextPhaseDate: '2026-06-01',
    characteristics: [
      'Crescimento',
      'Atração de energia',
      'Manifestação',
      'Aumento',
      'Abundância',
    ],
  },
  cheia: {
    phase: 'cheia',
    name: 'Lua Cheia',
    emoji: '🌕',
    description: 'Fase de culminação, revelação e energia máxima',
    illumination: '100%',
    nextPhase: 'minguante',
    nextPhaseDate: '2026-06-08',
    characteristics: [
      'Culminação',
      'Máxima energia',
      'Revelação',
      'Emoção intensificada',
      'Clareza',
    ],
  },
  minguante: {
    phase: 'minguante',
    name: 'Lua Minguante',
    emoji: '🌘',
    description: 'Fase de finalização, limpeza e liberação',
    illumination: '52-60%',
    nextPhase: 'nova',
    nextPhaseDate: '2026-05-17',
    characteristics: [
      'Finalizações',
      'Limpeza energética',
      'Liberação',
      'Organização',
      'Reflexão',
    ],
  },
};

// Rituais organizados por fase lunar
export const RITUAIS_GUIADOS: Ritual[] = [
  // RITUAIS MINGUANTE
  {
    id: 'ritual-limpeza-minguante',
    title: 'Ritual de Limpeza Energética',
    description: 'Limpe energias negativas e se prepare para novos ciclos',
    phase: 'minguante',
    duration: '15-20 minutos',
    difficulty: 'fácil',
    category: 'Limpeza',
    materials: [
      'Vela branca',
      'Água',
      'Sal marinho',
      'Incenso ou alecrim',
    ],
    steps: [
      {
        order: 1,
        title: 'Preparação do espaço',
        description:
          'Encontre um local calmo. Acenda uma vela branca e abra as janelas para permitir circulação de ar.',
        duration: '2 minutos',
      },
      {
        order: 2,
        title: 'Limpeza com elementos',
        description:
          'Passe incenso ou alecrim queimado ao redor do seu corpo, começando pela cabeça até os pés. Visualize energias negativas sendo removidas.',
        duration: '8 minutos',
      },
      {
        order: 3,
        title: 'Banho de sal',
        description:
          'Dissolva sal marinho em água morna. Passe pelas mãos, rosto e pescoço enquanto repete: "Estou limpo, renovado e protegido".',
        duration: '5 minutos',
      },
      {
        order: 4,
        title: 'Fechamento',
        description:
          'Agradece ao universo pela limpeza realizada. Deixe a vela queimar completamente ou apague com cuidado.',
        duration: '2 minutos',
      },
    ],
    suggestedCards: [13, 20], // Morte (transformação) e Julgamento
    benefits: [
      'Limpeza energética profunda',
      'Liberação de padrões antigos',
      'Renovação espiritual',
      'Proteção energética',
    ],
    affirmation: 'Libero o que não me serve mais e abro espaço para o novo',
  },
  {
    id: 'ritual-reflexao-minguante',
    title: 'Ritual de Reflexão e Soltura',
    description: 'Reflita sobre o ciclo passado e solte o que não lhe serve',
    phase: 'minguante',
    duration: '20-25 minutos',
    difficulty: 'fácil',
    category: 'Introspecção',
    materials: [
      'Diário ou papel',
      'Caneta',
      'Vela azul ou roxo',
      'Opcional: fogo seguro para queimar papel',
    ],
    steps: [
      {
        order: 1,
        title: 'Meditação inicial',
        description:
          'Sente confortavelmente e feche os olhos. Respire profundamente por 3 minutos, focando no que você deseja soltar.',
        duration: '5 minutos',
      },
      {
        order: 2,
        title: 'Escrita reflexiva',
        description:
          'Escreva tudo o que você quer deixar para trás neste ciclo. Não se preocupe com perfeição, deixe fluir.',
        duration: '10 minutos',
      },
      {
        order: 3,
        title: 'Visualização e libertação',
        description:
          'Releia o que escreveu, visualize essas situações sendo dissolvidas. Se possível, queime o papel com segurança.',
        duration: '7 minutos',
      },
      {
        order: 4,
        title: 'Afirmação de soltura',
        description:
          'Repita a afirmação: "Sou livre. Solto o passado e caminho em frente com leveza e propósito".',
        duration: '3 minutos',
      },
    ],
    suggestedCards: [16, 12], // Torre (transformação) e O Enforcado (perspectiva)
    benefits: [
      'Clareza sobre o ciclo passado',
      'Libertação emocional',
      'Preparação para novos ciclos',
      'Paz interior',
    ],
    affirmation: 'Solto com amor e gratidão tudo o que foi',
  },

  // RITUAIS LUA NOVA
  {
    id: 'ritual-intencoes-nova',
    title: 'Ritual de Intenções',
    description: 'Estableleça novas intenções e semeie seus desejos',
    phase: 'nova',
    duration: '25-30 minutos',
    difficulty: 'moderado',
    category: 'Manifestação',
    materials: [
      'Papel ou diário',
      'Caneta preta',
      'Vela preta ou branca',
      'Cristal (opcional)',
    ],
    steps: [
      {
        order: 1,
        title: 'Centralização',
        description:
          'Crie um espaço sagrado. Acenda a vela e sente em silêncio por 5 minutos, focando em suas aspirações.',
        duration: '5 minutos',
      },
      {
        order: 2,
        title: 'Clarificação de intenções',
        description:
          'Escreva suas intenções como se já fossem verdade. Use presente: "Eu sou...", "Eu tenho...", "Eu crio..."',
        duration: '10 minutos',
      },
      {
        order: 3,
        title: 'Energização',
        description:
          'Segure o papel sobre a vela (com cuidado) ou coloque um cristal sobre ele. Visualize essa intenção se manifestando.',
        duration: '8 minutos',
      },
      {
        order: 4,
        title: 'Fechamento',
        description:
          'Guarde o papel em local seguro ou coloque sob seu travesseiro durante a noite. Deixe a vela queimar completamente se possível.',
        duration: '2 minutos',
      },
    ],
    suggestedCards: [0, 1], // O Louco e O Mago (novos começos e manifestação)
    benefits: [
      'Clarificação de objetivos',
      'Programação do universo',
      'Alinhamento com intenções',
      'Manifestação acelerada',
    ],
    affirmation: 'Minhas intenções estão alinhadas com o universo e se manifestam com perfeição',
  },

  // RITUAIS LUA CRESCENTE
  {
    id: 'ritual-abundancia-crescente',
    title: 'Ritual de Abundância',
    description: 'Atraia abundância, prosperidade e crescimento',
    phase: 'crescente',
    duration: '20 minutos',
    difficulty: 'fácil',
    category: 'Prosperidade',
    materials: [
      'Moedas ou dinheiro',
      'Vela verde ou dourada',
      'Ervas: canela, gengibre',
      'Prato ou tigela',
    ],
    steps: [
      {
        order: 1,
        title: 'Preparação',
        description:
          'Coloque moedas e ervas no prato. Acenda a vela verde ou dourada ao lado, focando em gratidão.',
        duration: '3 minutos',
      },
      {
        order: 2,
        title: 'Meditação de atração',
        description:
          'Com as mãos sobre o prato, visualize energia de abundância fluindo para sua vida. Sinta a sensação de já ter o que deseja.',
        duration: '10 minutos',
      },
      {
        order: 3,
        title: 'Afirmação poderosa',
        description:
          'Repita: "Sou um ímã de abundância. Prosperidade flui para mim em formas esperadas e inesperadas".',
        duration: '5 minutos',
      },
      {
        order: 4,
        title: 'Ação de gratidão',
        description:
          'Guarde as moedas como lembrança. Considere fazer uma doação ou ajudar alguém em comemoração.',
        duration: '2 minutos',
      },
    ],
    suggestedCards: [10, 3], // Roda da Fortuna e A Imperatriz (abundância)
    benefits: [
      'Atração de prosperidade',
      'Aumento de receita',
      'Mentalidade de abundância',
      'Oportunidades financeiras',
    ],
    affirmation: 'A abundância é meu direito natural e flui livremente para mim',
  },

  // RITUAIS LUA CHEIA
  {
    id: 'ritual-revelacao-cheia',
    title: 'Ritual de Revelação e Culminação',
    description: 'Celebre culminações e revele sua verdade interior',
    phase: 'cheia',
    duration: '30 minutos',
    difficulty: 'moderado',
    category: 'Poder',
    materials: [
      'Vela branca ou prata',
      'Espelho',
      'Água',
      'Música relaxante (opcional)',
    ],
    steps: [
      {
        order: 1,
        title: 'Ceremônia de abertura',
        description:
          'Acenda a vela e passe água no rosto enquanto se olha no espelho. Reconheça o seu poder interno.',
        duration: '5 minutos',
      },
      {
        order: 2,
        title: 'Dança ou movimento consciente',
        description:
          'Mova seu corpo livremente, celebrando suas vitórias do ciclo. Deixe sua energia transbordante se expressar.',
        duration: '10 minutos',
      },
      {
        order: 3,
        title: 'Declaração de poder',
        description:
          'Olhe para o espelho e declare tudo o que conquistou. Seja específico e celebre cada vitória, grande ou pequena.',
        duration: '10 minutos',
      },
      {
        order: 4,
        title: 'Fechamento gratidão',
        description:
          'Agradeca ao universo pela energia da lua cheia. Deixe a vela queimar enquanto você medita sobre suas bênçãos.',
        duration: '5 minutos',
      },
    ],
    suggestedCards: [19, 21], // O Sol e O Mundo (completude e realização)
    benefits: [
      'Reconhecimento de poder',
      'Celebração de vitórias',
      'Clareza máxima',
      'Manifestação de desejos profundos',
    ],
    affirmation: 'Sou poderoso, completo e digno de todas as minhas bênçãos',
  },
];

export function getCurrentLunarPhase(): LunarPhase {
  // 11 de maio de 2026 é Minguante
  const today = new Date('2026-05-11');
  return 'minguante';
}

export function getLunarPhaseInfo(phase: LunarPhase): LunarPhaseInfo {
  return LUNAR_PHASES[phase];
}

export function getRituaisByPhase(phase: LunarPhase): Ritual[] {
  return RITUAIS_GUIADOS.filter((ritual) => ritual.phase === phase);
}

export function getRitualById(id: string): Ritual | undefined {
  return RITUAIS_GUIADOS.find((ritual) => ritual.id === id);
}
