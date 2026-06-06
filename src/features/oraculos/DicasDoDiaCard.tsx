import { Text, View } from '@/components/Themed';
import { useMemo } from 'react';
import type { SignoNome } from '../../../constants/OraculoData';
import { useTranslation } from '../../i18n/useTranslation';
import { dashboardScreenStyles as styles } from '../../styles/screens/DashboardScreenStyles';
import { getDicasDoDia } from './dicasDoDia';

type Props = {
  signo: SignoNome;
};

export function DicasDoDiaCard({ signo }: Props) {
  const { t } = useTranslation();
  const dicas = useMemo(() => getDicasDoDia(signo), [signo]);

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{t('oraculos.tipsOfTheDay')}</Text>
      <Text style={styles.baseText}>{t('oraculos.dayColor')} {dicas.cor}</Text>
      <Text style={styles.baseText}>{t('oraculos.luckyNumber')} {dicas.numeroDaSorte}</Text>
      <Text style={styles.baseText}>{t('oraculos.supportHerb')} {dicas.erva}</Text>

      <View style={styles.tipsHighlight}>
        <Text style={styles.tipsHighlightLabel}>{t('oraculos.advice')}</Text>
        <Text style={styles.tipsHighlightText}>{dicas.conselho}</Text>
      </View>
    </View>
  );
}
