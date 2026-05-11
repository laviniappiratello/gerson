import { Text, View } from '@/components/Themed';
import { useMemo } from 'react';
import type { SignoNome } from '../../../constants/OraculoData';
import { dashboardScreenStyles as styles } from '../../styles/screens/DashboardScreenStyles';
import { getDicasDoDia } from './dicasDoDia';

type Props = {
  signo: SignoNome;
};

export function DicasDoDiaCard({ signo }: Props) {
  const dicas = useMemo(() => getDicasDoDia(signo), [signo]);

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>Dicas do Dia</Text>
      <Text style={styles.baseText}>Cor do dia: {dicas.cor}</Text>
      <Text style={styles.baseText}>Número da sorte: {dicas.numeroDaSorte}</Text>
      <Text style={styles.baseText}>Erva de apoio: {dicas.erva}</Text>

      <View style={styles.tipsHighlight}>
        <Text style={styles.tipsHighlightLabel}>Conselho</Text>
        <Text style={styles.tipsHighlightText}>{dicas.conselho}</Text>
      </View>
    </View>
  );
}
