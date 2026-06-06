import { Text, View } from '@/components/Themed';
import { useMemo } from 'react';
import { Image, ScrollView } from 'react-native';
import { INFO_ARCANOS, INFO_SIGNOS } from '../../constants/MisticoData';
import { TAROT_CARDS, getPrevisaoDoDia } from '../../constants/OraculoData';
import { useAuth } from '../../src/context/AuthContext';
import { DicasDoDiaCard } from '../../src/features/oraculos/DicasDoDiaCard';
import { useTranslation } from '../../src/i18n/useTranslation';
import { globalStyles as GStyles } from '../../src/styles/GlobalStyles';
import { dashboardScreenStyles as styles } from '../../src/styles/screens/DashboardScreenStyles';

export default function DashboardScreen() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  const previsao = useMemo(() => {
    if (!user) return '';
    return getPrevisaoDoDia(user.signo);
  }, [user]);

  const cartaDoDia = useMemo(() => {
    if (!user) return null;
    const today = new Date();
    const sumChars = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const daySeed = today.getFullYear() * 1000 + today.getMonth() * 50 + today.getDate() + sumChars;
    const index = Math.abs(daySeed) % TAROT_CARDS.length;
    return TAROT_CARDS[index];
  }, [user]);

  if (isLoading || !user) {
    return (
      <View style={GStyles.container}>
        <Text style={GStyles.title}>{t('dashboard.loadingDestiny')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>✦ PERFIL</Text>
      <Text style={GStyles.title}>{t('dashboard.title')}</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>{t('dashboard.profile')}</Text>
        <Text style={styles.baseText}>{t('dashboard.sign')}: {user.signo}</Text>
        <Text style={styles.baseText}>{t('dashboard.personalArcana')}: {user.arcano}</Text>

        <View style={styles.row}>
          <Image source={INFO_SIGNOS[user.signo]?.imagem} style={styles.signImage} resizeMode="contain" />
          <Image source={INFO_ARCANOS[user.arcano]?.imagem} style={styles.arcanoImage} resizeMode="contain" />
        </View>

        <Text style={styles.previsaoLabel}>{t('dashboard.dayForecast')}</Text>
        <Text style={styles.previsao}>{previsao}</Text>
      </View>

      <DicasDoDiaCard signo={user.signo} />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>{t('dashboard.cardOfTheDay')}</Text>
        {cartaDoDia ? (
          <>
            <Text style={styles.cardTitle}>{cartaDoDia.nome}</Text>
            <Image source={cartaDoDia.imagem} style={styles.readingCardImage} resizeMode="contain" />
            <Text style={styles.baseText}>{cartaDoDia.interpretacaoNormal}</Text>
          </>
        ) : null}
      </View>

      <Text style={styles.footnote}>
        {t('dashboard.offlineData')}
      </Text>
    </ScrollView>
    </View>
  );
}

