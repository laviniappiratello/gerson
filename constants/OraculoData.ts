export type SignoNome =
  | 'Áries'
  | 'Touro'
  | 'Gêmeos'
  | 'Câncer'
  | 'Leão'
  | 'Virgem'
  | 'Libra'
  | 'Escorpião'
  | 'Sagitário'
  | 'Capricórnio'
  | 'Aquário'
  | 'Peixes';

export type TarotCard = {
  id: number;
  nome: string;
  imagem: any;
  interpretacaoNormal: string;
  interpretacaoInvertida: string;
};

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 1,
    nome: 'O Mago',
    imagem: require('../assets/images/arcanos/mago.png'),
    interpretacaoNormal: 'Iniciativa, habilidade e poder de manifestar.',
    interpretacaoInvertida: 'Impulsividade, manipulação ou energia dispersa.',
  },
  {
    id: 2,
    nome: 'A Sacerdotisa',
    imagem: require('../assets/images/arcanos/sacerdotisa.png'),
    interpretacaoNormal: 'Intuição forte e leitura profunda do cenário.',
    interpretacaoInvertida: 'Bloqueio intuitivo ou segredos mal resolvidos.',
  },
  {
    id: 3,
    nome: 'A Imperatriz',
    imagem: require('../assets/images/arcanos/imperatriz.png'),
    interpretacaoNormal: 'Crescimento, criatividade e fertilidade de ideias.',
    interpretacaoInvertida: 'Estagnação criativa ou excesso de conforto.',
  },
  {
    id: 4,
    nome: 'O Imperador',
    imagem: require('../assets/images/arcanos/imperador.png'),
    interpretacaoNormal: 'Estrutura, liderança e segurança material.',
    interpretacaoInvertida: 'Rigidez, controle excessivo ou autoritarismo.',
  },
  {
    id: 5,
    nome: 'O Hierofante',
    imagem: require('../assets/images/arcanos/hierofante.png'),
    interpretacaoNormal: 'Aprendizado, tradição e aconselhamento.',
    interpretacaoInvertida: 'Dogmas, teimosia ou ruptura com referências.',
  },
  {
    id: 6,
    nome: 'Os Enamorados',
    imagem: require('../assets/images/arcanos/enamorados.png'),
    interpretacaoNormal: 'Escolhas alinhadas com valores e afeto.',
    interpretacaoInvertida: 'Dúvida, indecisão e conflitos internos.',
  },
  {
    id: 7,
    nome: 'O Carro',
    imagem: require('../assets/images/arcanos/carro.png'),
    interpretacaoNormal: 'Avanço, foco e conquista por disciplina.',
    interpretacaoInvertida: 'Falta de direção ou pressa sem estratégia.',
  },
  {
    id: 8,
    nome: 'A Justiça',
    imagem: require('../assets/images/arcanos/justica.png'),
    interpretacaoNormal: 'Clareza, equilíbrio e decisões justas.',
    interpretacaoInvertida: 'Autojulgamento, injustiça ou negação de fatos.',
  },
  {
    id: 9,
    nome: 'O Eremita',
    imagem: require('../assets/images/arcanos/eremita.png'),
    interpretacaoNormal: 'Recolhimento produtivo e sabedoria.',
    interpretacaoInvertida: 'Isolamento excessivo e distanciamento.',
  },
  {
    id: 10,
    nome: 'A Roda da Fortuna',
    imagem: require('../assets/images/arcanos/roda.png'),
    interpretacaoNormal: 'Viradas positivas e mudanças de ciclo.',
    interpretacaoInvertida: 'Imprevisibilidade e sensação de perda de controle.',
  },
  {
    id: 11,
    nome: 'A Força',
    imagem: require('../assets/images/arcanos/forca.png'),
    interpretacaoNormal: 'Coragem emocional e domínio interno.',
    interpretacaoInvertida: 'Insegurança, cansaço ou reatividade.',
  },
  {
    id: 12,
    nome: 'O Pendurado',
    imagem: require('../assets/images/arcanos/pendurado.png'),
    interpretacaoNormal: 'Pausa necessária e nova perspectiva.',
    interpretacaoInvertida: 'Resistência à mudança e vitimização.',
  },
  {
    id: 13,
    nome: 'A Morte',
    imagem: require('../assets/images/arcanos/morte.png'),
    interpretacaoNormal: 'Fim de ciclo e transformação profunda.',
    interpretacaoInvertida: 'Apego ao passado e dificuldade de encerrar fases.',
  },
  {
    id: 14,
    nome: 'A Temperança',
    imagem: require('../assets/images/arcanos/temperanca.png'),
    interpretacaoNormal: 'Harmonia, paciência e cura gradual.',
    interpretacaoInvertida: 'Desequilíbrio e exageros recorrentes.',
  },
  {
    id: 15,
    nome: 'O Diabo',
    imagem: require('../assets/images/arcanos/diabo.png'),
    interpretacaoNormal: 'Confronto com desejos, apegos e sombras.',
    interpretacaoInvertida: 'Libertação de padrões tóxicos e vícios.',
  },
  {
    id: 16,
    nome: 'A Torre',
    imagem: require('../assets/images/arcanos/torre.png'),
    interpretacaoNormal: 'Queda de estruturas e verdade revelada.',
    interpretacaoInvertida: 'Medo da ruptura e crise prolongada.',
  },
  {
    id: 17,
    nome: 'A Estrela',
    imagem: require('../assets/images/arcanos/estrela.png'),
    interpretacaoNormal: 'Esperança, inspiração e renovação.',
    interpretacaoInvertida: 'Desânimo temporário e perda de fé.',
  },
  {
    id: 18,
    nome: 'A Lua',
    imagem: require('../assets/images/arcanos/lua.png'),
    interpretacaoNormal: 'Sensibilidade alta e leitura simbólica.',
    interpretacaoInvertida: 'Confusão emocional ou ilusões.',
  },
  {
    id: 19,
    nome: 'O Sol',
    imagem: require('../assets/images/arcanos/sol.png'),
    interpretacaoNormal: 'Vitalidade, clareza e expansão.',
    interpretacaoInvertida: 'Ego em excesso ou dificuldade em celebrar.',
  },
  {
    id: 20,
    nome: 'O Julgamento',
    imagem: require('../assets/images/arcanos/julgamento.png'),
    interpretacaoNormal: 'Chamado interno e despertar de consciência.',
    interpretacaoInvertida: 'Autojulgamento severo e adiamento de decisões.',
  },
  {
    id: 21,
    nome: 'O Mundo',
    imagem: require('../assets/images/arcanos/mundo.png'),
    interpretacaoNormal: 'Conclusão bem-sucedida e realização.',
    interpretacaoInvertida: 'Ciclo pendente e sensação de incompletude.',
  },
  {
    id: 22,
    nome: 'O Louco',
    imagem: require('../assets/images/arcanos/louco.png'),
    interpretacaoNormal: 'Recomeço, espontaneidade e coragem de tentar.',
    interpretacaoInvertida: 'Imprudência ou medo de começar.',
  },
];

export const HOROSCOPO_DIARIO: Record<SignoNome, string[]> = {
  Áries: [
    'Hoje você ganha força quando age com foco em uma meta só.',
    'Evite responder no impulso: estratégia vale mais que velocidade.',
  ],
  Touro: [
    'A constância de hoje abre resultado concreto nos próximos dias.',
    'Um ajuste pequeno na rotina pode trazer grande conforto.',
  ],
  Gêmeos: [
    'Uma conversa certa muda completamente sua perspectiva.',
    'Canalize sua curiosidade em uma prioridade para render melhor.',
  ],
  Câncer: [
    'Seu cuidado com os detalhes emocionais fortalece vínculos.',
    'Proteja sua energia sem se fechar para novas trocas.',
  ],
  Leão: [
    'Seu brilho aumenta quando você compartilha protagonismo.',
    'Mostre seu trabalho com confiança, sem precisar provar nada.',
  ],
  Virgem: [
    'Organizar o ambiente vai destravar sua mente hoje.',
    'Confie no processo: perfeição pode esperar, consistência não.',
  ],
  Libra: [
    'Diplomacia será seu diferencial em decisões importantes.',
    'Escolher por você também é um ato de equilíbrio.',
  ],
  Escorpião: [
    'A profundidade que você sente hoje revela um caminho real.',
    'Transforme intensidade em ação prática e objetiva.',
  ],
  Sagitário: [
    'Sua visão de futuro inspira quem está à sua volta.',
    'Aventurar com responsabilidade rende melhores descobertas.',
  ],
  Capricórnio: [
    'Disciplina hoje gera segurança amanhã.',
    'Priorize o essencial: menos tarefas, mais entrega.',
  ],
  Aquário: [
    'Uma ideia fora do padrão pode virar solução central.',
    'Conexões com pessoas diferentes ampliam suas oportunidades.',
  ],
  Peixes: [
    'Sua intuição está afiada, use-a junto com fatos.',
    'Criatividade e sensibilidade serão sua vantagem no dia.',
  ],
};

export function getPrevisaoDoDia(signo: SignoNome, date = new Date()): string {
  const lista = HOROSCOPO_DIARIO[signo] ?? ['Hoje é um bom dia para confiar no seu processo.'];
  const idx = date.getDate() % lista.length;
  return lista[idx];
}
