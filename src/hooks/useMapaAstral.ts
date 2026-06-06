import { useMemo } from 'react';
import { gerarMapaAstral } from '../services/astralMap';

export const useMapaAstral = (dataDeNascimento: string, horaDeNascimento?: string) => {
  const mapaAstral = useMemo(() => {
    if (!dataDeNascimento) return null;

    // Parse data: YYYY-MM-DD
    const [ano, mes, dia] = dataDeNascimento.split('-').map(Number);

    // Parse hora: HH:MM (padrão 12:00 se não informada)
    let hora = 12;
    let minuto = 0;

    if (horaDeNascimento) {
      const [h, m] = horaDeNascimento.split(':').map(Number);
      hora = h || 12;
      minuto = m || 0;
    }

    return gerarMapaAstral(dia, mes, ano, hora, minuto);
  }, [dataDeNascimento, horaDeNascimento]);

  return mapaAstral;
};
