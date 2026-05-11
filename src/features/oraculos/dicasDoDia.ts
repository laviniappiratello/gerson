import type { SignoNome } from '../../../constants/OraculoData';

type DicasDoDiaBase = {
  cores: string[];
  numeros: number[];
  ervas: string[];
  conselho: string;
};

export type DicasDoDia = {
  cor: string;
  numeroDaSorte: number;
  erva: string;
  conselho: string;
};

const DICAS_POR_SIGNO: Record<SignoNome, DicasDoDiaBase> = {
  'Áries': {
    cores: ['Vermelho', 'Laranja queimado'],
    numeros: [1, 9, 17],
    ervas: ['Alecrim', 'Gengibre', 'Canela'],
    conselho: 'Hoje sua energia cresce quando você escolhe uma meta e vai direto nela.',
  },
  'Touro': {
    cores: ['Verde musgo', 'Rosa antigo'],
    numeros: [2, 6, 22],
    ervas: ['Camomila', 'Hortelã', 'Lavanda'],
    conselho: 'O melhor resultado do dia vem de constância e conforto bem cuidados.',
  },
  'Gêmeos': {
    cores: ['Amarelo claro', 'Azul celeste'],
    numeros: [3, 12, 21],
    ervas: ['Erva-cidreira', 'Manjericão', 'Hortelã'],
    conselho: 'Uma conversa inteligente pode abrir uma oportunidade inesperada.',
  },
  'Câncer': {
    cores: ['Prata', 'Branco perolado'],
    numeros: [4, 8, 18],
    ervas: ['Camomila', 'Jasmim', 'Melissa'],
    conselho: 'Seu cuidado com o que sente também protege o que você constrói.',
  },
  'Leão': {
    cores: ['Dourado', 'Laranja solar'],
    numeros: [5, 10, 19],
    ervas: ['Alecrim', 'Girassol', 'Canela'],
    conselho: 'Seu brilho rende mais quando você compartilha o palco sem medo.',
  },
  'Virgem': {
    cores: ['Bege', 'Verde oliva'],
    numeros: [6, 14, 23],
    ervas: ['Sálvia', 'Capim-limão', 'Camomila'],
    conselho: 'Organizar uma prioridade hoje destrava o restante do seu dia.',
  },
  'Libra': {
    cores: ['Rosa claro', 'Azul pastel'],
    numeros: [7, 11, 24],
    ervas: ['Lavanda', 'Rosa', 'Erva-doce'],
    conselho: 'Equilíbrio real também inclui escolher por você sem culpa.',
  },
  'Escorpião': {
    cores: ['Vinho', 'Preto', 'Roxo profundo'],
    numeros: [8, 13, 27],
    ervas: ['Arruda', 'Absinto', 'Sálvia'],
    conselho: 'Sua profundidade encontra direção quando você transforma intensidade em foco.',
  },
  'Sagitário': {
    cores: ['Azul índigo', 'Roxo vibrante'],
    numeros: [9, 15, 33],
    ervas: ['Alecrim', 'Louro', 'Sálvia'],
    conselho: 'A expansão fica melhor quando vem com um plano simples de ação.',
  },
  'Capricórnio': {
    cores: ['Cinza pedra', 'Marrom terra'],
    numeros: [10, 16, 28],
    ervas: ['Patchouli', 'Sálvia', 'Alecrim'],
    conselho: 'Passos pequenos, mas consistentes, constroem muito mais do que parece.',
  },
  'Aquário': {
    cores: ['Azul elétrico', 'Turquesa'],
    numeros: [11, 17, 29],
    ervas: ['Lavanda', 'Hortelã', 'Erva-cidreira'],
    conselho: 'Uma ideia fora do padrão pode ser exatamente a resposta do dia.',
  },
  'Peixes': {
    cores: ['Lilás', 'Verde água'],
    numeros: [12, 18, 30],
    ervas: ['Camomila', 'Jasmim', 'Melissa'],
    conselho: 'Intuição e calma andam juntas quando você desacelera o ruído ao redor.',
  },
};

function buildSeed(signo: SignoNome, date: Date) {
  const signSeed = signo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const daySeed = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  return signSeed + daySeed;
}

function pickItem<T>(items: T[], seed: number, offset: number): T {
  return items[Math.abs(seed + offset) % items.length];
}

export function getDicasDoDia(signo: SignoNome, date = new Date()): DicasDoDia {
  const base = DICAS_POR_SIGNO[signo];
  const seed = buildSeed(signo, date);

  return {
    cor: pickItem(base.cores, seed, 1),
    numeroDaSorte: pickItem(base.numeros, seed, 7),
    erva: pickItem(base.ervas, seed, 13),
    conselho: base.conselho,
  };
}
