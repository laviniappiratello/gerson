import type { SignoNome } from '../../constants/OraculoData';

export type SignoAstral = {
  nome: SignoNome;
  simbolo: string;
  dataInicio: { mes: number; dia: number };
  dataFim: { mes: number; dia: number };
  elemento: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  qualidade: 'Cardeal' | 'Fixo' | 'Mutável';
  descricao: string;
  frase: string;
};

export type MapaAstral = {
  signoSolar: SignoAstral;
  ascendente: SignoAstral;
  signoLunar: SignoAstral;
  casas: AstralHouse[];
  personalidadeBaseada: string;
  aparencia: string;
  compatibilidades: string[];
};

export type AstralHouse = {
  numero: number;
  nome: string;
  signo: SignoAstral;
  descricao: string;
};

export type AscendenteRange = {
  hora_inicio: string;
  hora_fim: string;
  signo: SignoNome;
};

// Tabela de signos
export const SIGNOS_ASTRAIS: Record<SignoNome, SignoAstral> = {
  Áries: {
    nome: 'Áries',
    simbolo: '♈',
    dataInicio: { mes: 3, dia: 21 },
    dataFim: { mes: 4, dia: 19 },
    elemento: 'Fogo',
    qualidade: 'Cardeal',
    descricao: 'Energético, corajoso e impulsivo. Áries é o pioneir do zodíaco.',
    frase: 'Eu sou',
  },
  Touro: {
    nome: 'Touro',
    simbolo: '♉',
    dataInicio: { mes: 4, dia: 20 },
    dataFim: { mes: 5, dia: 20 },
    elemento: 'Terra',
    qualidade: 'Fixo',
    descricao: 'Estável, prático e sensual. Touro valoriza segurança e conforto.',
    frase: 'Eu tenho',
  },
  Gêmeos: {
    nome: 'Gêmeos',
    simbolo: '♊',
    dataInicio: { mes: 5, dia: 21 },
    dataFim: { mes: 6, dia: 20 },
    elemento: 'Ar',
    qualidade: 'Mutável',
    descricao: 'Comunicativo, versátil e curioso. Gêmeos adora aprender e conectar.',
    frase: 'Eu penso',
  },
  Câncer: {
    nome: 'Câncer',
    simbolo: '♋',
    dataInicio: { mes: 6, dia: 21 },
    dataFim: { mes: 7, dia: 22 },
    elemento: 'Água',
    qualidade: 'Cardeal',
    descricao: 'Emocional, protetor e intuitivo. Câncer busca segurança emocional.',
    frase: 'Eu sinto',
  },
  Leão: {
    nome: 'Leão',
    simbolo: '♌',
    dataInicio: { mes: 7, dia: 23 },
    dataFim: { mes: 8, dia: 22 },
    elemento: 'Fogo',
    qualidade: 'Fixo',
    descricao: 'Criativo, generoso e dramático. Leão adora ser o centro das atenções.',
    frase: 'Eu crio',
  },
  Virgem: {
    nome: 'Virgem',
    simbolo: '♍',
    dataInicio: { mes: 8, dia: 23 },
    dataFim: { mes: 9, dia: 22 },
    elemento: 'Terra',
    qualidade: 'Mutável',
    descricao: 'Analítico, prático e perfeccionista. Virgem busca ordem e eficiência.',
    frase: 'Eu analiso',
  },
  Libra: {
    nome: 'Libra',
    simbolo: '♎',
    dataInicio: { mes: 9, dia: 23 },
    dataFim: { mes: 10, dia: 22 },
    elemento: 'Ar',
    qualidade: 'Cardeal',
    descricao: 'Equilibrado, diplomático e social. Libra busca harmonia e justiça.',
    frase: 'Eu equilibro',
  },
  Escorpião: {
    nome: 'Escorpião',
    simbolo: '♏',
    dataInicio: { mes: 10, dia: 23 },
    dataFim: { mes: 11, dia: 21 },
    elemento: 'Água',
    qualidade: 'Fixo',
    descricao: 'Profundo, intenso e secreto. Escorpião busca transformação e verdade.',
    frase: 'Eu desejo',
  },
  Sagitário: {
    nome: 'Sagitário',
    simbolo: '♐',
    dataInicio: { mes: 11, dia: 22 },
    dataFim: { mes: 12, dia: 21 },
    elemento: 'Fogo',
    qualidade: 'Mutável',
    descricao: 'Otimista, aventureiro e filosófico. Sagitário busca expansão e liberdade.',
    frase: 'Eu exploro',
  },
  Capricórnio: {
    nome: 'Capricórnio',
    simbolo: '♑',
    dataInicio: { mes: 12, dia: 22 },
    dataFim: { mes: 1, dia: 19 },
    elemento: 'Terra',
    qualidade: 'Cardeal',
    descricao: 'Ambicioso, disciplinado e responsável. Capricórnio busca sucesso e status.',
    frase: 'Eu alcanço',
  },
  Aquário: {
    nome: 'Aquário',
    simbolo: '♒',
    dataInicio: { mes: 1, dia: 20 },
    dataFim: { mes: 2, dia: 18 },
    elemento: 'Ar',
    qualidade: 'Fixo',
    descricao: 'Inovador, humanitário e excêntrico. Aquário busca liberdade e progresso.',
    frase: 'Eu sei',
  },
  Peixes: {
    nome: 'Peixes',
    simbolo: '♓',
    dataInicio: { mes: 2, dia: 19 },
    dataFim: { mes: 3, dia: 20 },
    elemento: 'Água',
    qualidade: 'Mutável',
    descricao: 'Sensível, empático e imaginativo. Peixes busca conexão espiritual.',
    frase: 'Eu acredito',
  },
};

// Tabela de Ascendentes por hora (simplificada para demonstração)
// Em astrologia real, isso depende de latitude/longitude, mas aqui usamos uma tabela fixa aproximada
export const ASCENDENTES_POR_HORA: AscendenteRange[] = [
  { hora_inicio: '00:00', hora_fim: '01:20', signo: 'Aquário' },
  { hora_inicio: '01:20', hora_fim: '02:40', signo: 'Peixes' },
  { hora_inicio: '02:40', hora_fim: '04:20', signo: 'Áries' },
  { hora_inicio: '04:20', hora_fim: '06:00', signo: 'Touro' },
  { hora_inicio: '06:00', hora_fim: '07:40', signo: 'Gêmeos' },
  { hora_inicio: '07:40', hora_fim: '09:20', signo: 'Câncer' },
  { hora_inicio: '09:20', hora_fim: '11:00', signo: 'Leão' },
  { hora_inicio: '11:00', hora_fim: '12:40', signo: 'Virgem' },
  { hora_inicio: '12:40', hora_fim: '14:20', signo: 'Libra' },
  { hora_inicio: '14:20', hora_fim: '16:00', signo: 'Escorpião' },
  { hora_inicio: '16:00', hora_fim: '17:40', signo: 'Sagitário' },
  { hora_inicio: '17:40', hora_fim: '19:20', signo: 'Capricórnio' },
  { hora_inicio: '19:20', hora_fim: '21:00', signo: 'Aquário' },
  { hora_inicio: '21:00', hora_fim: '22:40', signo: 'Peixes' },
  { hora_inicio: '22:40', hora_fim: '00:00', signo: 'Áries' },
];

// Tabela de Lua por mês (simplificada)
export const LUA_POR_MES: Record<number, SignoNome[]> = {
  1: ['Capricórnio', 'Aquário'],
  2: ['Aquário', 'Peixes'],
  3: ['Peixes', 'Áries'],
  4: ['Áries', 'Touro'],
  5: ['Touro', 'Gêmeos'],
  6: ['Gêmeos', 'Câncer'],
  7: ['Câncer', 'Leão'],
  8: ['Leão', 'Virgem'],
  9: ['Virgem', 'Libra'],
  10: ['Libra', 'Escorpião'],
  11: ['Escorpião', 'Sagitário'],
  12: ['Sagitário', 'Capricórnio'],
};

// Casas astrológicas
export const CASAS_ASTRAIS: Record<number, { nome: string; tema: string; descricao: string }> = {
  1: {
    nome: 'Casa I',
    tema: 'Self / Identidade',
    descricao: 'Sua personalidade, aparência e primeira impressão',
  },
  2: { nome: 'Casa II', tema: 'Valores / Recursos', descricao: 'Finanças, posses e auto-estima' },
  3: {
    nome: 'Casa III',
    tema: 'Comunicação / Irmãos',
    descricao: 'Comunicação, aprendizado e relacionamentos próximos',
  },
  4: { nome: 'Casa IV', tema: 'Lar / Família', descricao: 'Família, casa e raízes' },
  5: { nome: 'Casa V', tema: 'Criatividade / Romance', descricao: 'Criatividade, romance e prazer' },
  6: { nome: 'Casa VI', tema: 'Saúde / Trabalho', descricao: 'Saúde, rotina e trabalho' },
  7: { nome: 'Casa VII', tema: 'Relacionamentos', descricao: 'Casamento, parcerias e relacionamentos' },
  8: { nome: 'Casa VIII', tema: 'Transformação / Morte', descricao: 'Transformação, tabu e morte' },
  9: { nome: 'Casa IX', tema: 'Filosofia / Viagens', descricao: 'Educação superior, viagens e filosofia' },
  10: { nome: 'Casa X', tema: 'Carreira / Reputação', descricao: 'Carreira, reputação e público' },
  11: { nome: 'Casa XI', tema: 'Amigos / Esperança', descricao: 'Amigos, comunidade e esperança' },
  12: {
    nome: 'Casa XII',
    tema: 'Espiritualidade / Karma',
    descricao: 'Espiritualidade, subconsciente e karma',
  },
};

// Compatibilidades entre signos
export const COMPATIBILIDADES: Record<SignoNome, { compativel: SignoNome[]; complementar: SignoNome[] }> = {
  Áries: {
    compativel: ['Leão', 'Sagitário', 'Áries', 'Gêmeos'],
    complementar: ['Libra'],
  },
  Touro: {
    compativel: ['Virgem', 'Capricórnio', 'Touro', 'Câncer'],
    complementar: ['Escorpião'],
  },
  Gêmeos: {
    compativel: ['Libra', 'Aquário', 'Gêmeos', 'Áries'],
    complementar: ['Sagitário'],
  },
  Câncer: {
    compativel: ['Escorpião', 'Peixes', 'Câncer', 'Touro'],
    complementar: ['Capricórnio'],
  },
  Leão: {
    compativel: ['Sagitário', 'Áries', 'Leão', 'Libra'],
    complementar: ['Aquário'],
  },
  Virgem: {
    compativel: ['Capricórnio', 'Touro', 'Virgem', 'Escorpião'],
    complementar: ['Peixes'],
  },
  Libra: {
    compativel: ['Aquário', 'Gêmeos', 'Libra', 'Leão'],
    complementar: ['Áries'],
  },
  Escorpião: {
    compativel: ['Peixes', 'Câncer', 'Escorpião', 'Virgem'],
    complementar: ['Touro'],
  },
  Sagitário: {
    compativel: ['Áries', 'Leão', 'Sagitário', 'Aquário'],
    complementar: ['Gêmeos'],
  },
  Capricórnio: {
    compativel: ['Touro', 'Virgem', 'Capricórnio', 'Peixes'],
    complementar: ['Câncer'],
  },
  Aquário: {
    compativel: ['Gêmeos', 'Libra', 'Aquário', 'Sagitário'],
    complementar: ['Leão'],
  },
  Peixes: {
    compativel: ['Câncer', 'Escorpião', 'Peixes', 'Capricórnio'],
    complementar: ['Virgem'],
  },
};

// Função para calcular signo solar a partir da data
export function calcularSignoSolar(dia: number, mes: number): SignoAstral {
  for (const [_, signo] of Object.entries(SIGNOS_ASTRAIS)) {
    const inicio = signo.dataInicio;
    const fim = signo.dataFim;

    if (inicio.mes === fim.mes) {
      if (mes === inicio.mes && dia >= inicio.dia && dia <= fim.dia) {
        return signo;
      }
    } else {
      if ((mes === inicio.mes && dia >= inicio.dia) || (mes === fim.mes && dia <= fim.dia)) {
        return signo;
      }
    }
  }

  return SIGNOS_ASTRAIS['Áries'];
}

// Função para calcular ascendente a partir da hora
export function calcularAscendente(hora: number, minuto: number): SignoAstral {
  const totalMinutos = hora * 60 + minuto;
  const totalMinutosDia = 24 * 60;

  for (const range of ASCENDENTES_POR_HORA) {
    const [horaIni, minIni] = range.hora_inicio.split(':').map(Number);
    const [horaFim, minFim] = range.hora_fim.split(':').map(Number);

    const minIniTotal = horaIni * 60 + minIni;
    const minFimTotal = horaFim * 60 + minFim;

    if (minFimTotal < minIniTotal) {
      // Range que cruza meia-noite
      if (totalMinutos >= minIniTotal || totalMinutos < minFimTotal) {
        return SIGNOS_ASTRAIS[range.signo];
      }
    } else {
      if (totalMinutos >= minIniTotal && totalMinutos < minFimTotal) {
        return SIGNOS_ASTRAIS[range.signo];
      }
    }
  }

  return SIGNOS_ASTRAIS['Áries'];
}

// Função para calcular lua a partir do mês e dia
export function calcularSignoLunar(dia: number, mes: number): SignoAstral {
  const possiveisSignos = LUA_POR_MES[mes] || ['Áries'];
  const signoEscolhido = possiveisSignos[dia % 2] || possiveisSignos[0];
  return SIGNOS_ASTRAIS[signoEscolhido];
}

// Função principal para gerar mapa astral completo
export function gerarMapaAstral(
  dia: number,
  mes: number,
  ano: number,
  hora: number,
  minuto: number,
): MapaAstral {
  const signoSolar = calcularSignoSolar(dia, mes);
  const ascendente = calcularAscendente(hora, minuto);
  const signoLunar = calcularSignoLunar(dia, mes);

  // Gerar casas (distribuir signos pelas 12 casas)
  const todosSignos = Object.values(SIGNOS_ASTRAIS);
  const ascendenteIndex = todosSignos.findIndex((s) => s.nome === ascendente.nome);

  const casas: AstralHouse[] = [];
  for (let i = 1; i <= 12; i++) {
    const signoIndex = (ascendenteIndex + i - 1) % todosSignos.length;
    const signo = todosSignos[signoIndex];
    const casaInfo = CASAS_ASTRAIS[i];

    casas.push({
      numero: i,
      nome: casaInfo.nome,
      signo: signo,
      descricao: casaInfo.descricao,
    });
  }

  // Determinar compatibilidades
  const compativeis = COMPATIBILIDADES[signoSolar.nome]?.compativel || [];
  const complementar = COMPATIBILIDADES[signoSolar.nome]?.complementar || [];

  return {
    signoSolar,
    ascendente,
    signoLunar,
    casas,
    personalidadeBaseada: `Você é ${signoSolar.nome} por natureza (Solar), ${ascendente.nome} em essência (Ascendente) e ${signoLunar.nome} emocionalmente (Lunar). Essa combinação cria uma personalidade única e multidimensional.`,
    aparencia: `Seu ascendente ${ascendente.nome} pode influenciar sua aparência a ser mais ${getAparecenciaAscendente(ascendente.nome)} e seu comportamento ${getComportamentoAscendente(ascendente.nome)}.`,
    compatibilidades: [
      `Compatível com: ${compativeis.join(', ')}`,
      `Complementar com: ${complementar.join(', ')}`,
    ],
  };
}

function getAparecenciaAscendente(signo: SignoNome): string {
  const aparencias: Record<SignoNome, string> = {
    Áries: 'marcante e intenso',
    Touro: 'sensual e estável',
    Gêmeos: 'comunicativo e versátil',
    Câncer: 'carismático e protetor',
    Leão: 'radiante e magnético',
    Virgem: 'elegante e refinado',
    Libra: 'gracioso e harmônico',
    Escorpião: 'misterioso e profundo',
    Sagitário: 'expansivo e otimista',
    Capricórnio: 'elegante e autoridade',
    Aquário: 'diferente e inovador',
    Peixes: 'delicado e espiritual',
  };
  return aparencias[signo] || 'único';
}

function getComportamentoAscendente(signo: SignoNome): string {
  const comportamentos: Record<SignoNome, string> = {
    Áries: 'direto e impulsivo',
    Touro: 'calmo e determinado',
    Gêmeos: 'curioso e adaptável',
    Câncer: 'protetor e intuitivo',
    Leão: 'confiante e dramático',
    Virgem: 'analítico e perfeccionista',
    Libra: 'diplomático e justo',
    Escorpião: 'investigador e apaixonado',
    Sagitário: 'aventureiro e otimista',
    Capricórnio: 'ambicioso e responsável',
    Aquário: 'progressista e humanitário',
    Peixes: 'sensível e empático',
  };
  return comportamentos[signo] || 'interessante';
}
