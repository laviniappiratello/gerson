import { Text } from '@/components/Themed';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useMapaAstral } from '../../src/hooks/useMapaAstral';
import { useTranslation } from '../../src/i18n/useTranslation';
import { makeGlobalStyles, getColors } from '../../src/styles/GlobalStyles';

export default function MapaAstralScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { isLight } = useTheme();
  const GStyles = makeGlobalStyles(isLight);
  const styles = makeStyles(isLight);
  const C = getColors(isLight);
  const mapaAstral = useMapaAstral(user?.birthDate || '');
  const [expandedSection, setExpandedSection] = useState<string | null>('solar');
  const [selectedCasa, setSelectedCasa] = useState<number | null>(null);

  if (!user || !mapaAstral) {
    return (
      <View style={styles.container}>
        <Text style={GStyles.title}>{t('astralMap.title')}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('astralMap.loginRequired')}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('astralMap.yourAstralMap')}</Text>
        <Text style={styles.birthDate}>
          {t('astralMap.bornOn')} {new Date(user.birthDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'pt-BR')}
        </Text>
      </View>

      <View style={styles.tripleAstrologicalGrid}>
        {[
          { label: `☀️ ${t('astralMap.sunEgo')}`, signo: mapaAstral.signoSolar, motto: translateSignMotto(mapaAstral.signoSolar.nome, t) },
          { label: `🌙 ${t('astralMap.moonEmotion')}`, signo: mapaAstral.signoLunar, motto: translateSignMotto(mapaAstral.signoLunar.nome, t) },
          { label: `⬆️ ${t('astralMap.ascendant')}`, signo: mapaAstral.ascendente, motto: t('astralMap.firstImpression') },
        ].map((item) => (
          <View key={item.label} style={styles.tripleCard}>
            <Text style={styles.tripleLabel}>{item.label}</Text>
            <Text style={styles.tripleSigno}>{translateSign(item.signo.nome, t)}</Text>
            <Text style={styles.tripleSymbol}>{item.signo.simbolo}</Text>
            <Text style={styles.tripleDescricao}>{item.motto}</Text>
          </View>
        ))}
      </View>

      {[
        { key: 'personalidade', icon: '📊', title: t('astralMap.personalitySection'), content: (
          <View style={styles.cardContent}>
            <Text style={styles.descriptionText}>{mapaAstral.personalidadeBaseada}</Text>
            <Text style={styles.descriptionText}>{mapaAstral.aparencia}</Text>
          </View>
        )},
        { key: 'elementos', icon: '🔥', title: t('astralMap.elementsSection'), content: (
          <View style={styles.cardContent}>
            {[
              { label: t('astralMap.sunLabel'), signo: mapaAstral.signoSolar },
              { label: t('astralMap.moonLabel'), signo: mapaAstral.signoLunar },
              { label: t('astralMap.ascendantLabel'), signo: mapaAstral.ascendente },
            ].map((row) => (
              <View key={row.label} style={styles.elementRow}>
                <Text style={styles.elementLabel}>{row.label}</Text>
                <Text style={styles.elementValue}>{row.signo.elemento} / {row.signo.qualidade}</Text>
              </View>
            ))}
          </View>
        )},
        { key: 'compatibilidade', icon: '💕', title: t('astralMap.compatibilitySection'), content: (
          <View style={styles.cardContent}>
            {mapaAstral.compatibilidades.map((compat, idx) => (
              <Text key={idx} style={styles.descriptionText}>{compat}</Text>
            ))}
          </View>
        )},
        { key: 'descricoes', icon: '📖', title: t('astralMap.signDescriptionsSection'), content: (
          <View style={styles.cardContent}>
            {[mapaAstral.signoSolar, mapaAstral.signoLunar, mapaAstral.ascendente].map((s, i) => (
              <View key={i} style={styles.signDescription}>
                <Text style={styles.signTitle}>{['☀️','🌙','⬆️'][i]} {translateSign(s.nome, t)}</Text>
                <Text style={styles.signText}>{s.descricao}</Text>
              </View>
            ))}
          </View>
        )},
      ].map((section) => (
        <TouchableOpacity key={section.key} style={styles.expandableCard} onPress={() => setExpandedSection(expandedSection === section.key ? null : section.key)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{section.icon} {section.title}</Text>
            <Text style={styles.toggleIcon}>{expandedSection === section.key ? '▾' : '▸'}</Text>
          </View>
          {expandedSection === section.key ? section.content : null}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.expandableCard} onPress={() => setExpandedSection(expandedSection === 'casas' ? null : 'casas')}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🏠 {t('astralMap.housesSection')}</Text>
          <Text style={styles.toggleIcon}>{expandedSection === 'casas' ? '▾' : '▸'}</Text>
        </View>
        {expandedSection === 'casas' ? (
          <View style={styles.cardContent}>
            <View style={styles.casasGrid}>
              {mapaAstral.casas.map((casa) => (
                <TouchableOpacity key={casa.numero} style={[styles.casaCard, selectedCasa === casa.numero ? styles.casaCardSelected : null]} onPress={() => setSelectedCasa(selectedCasa === casa.numero ? null : casa.numero)}>
                  <Text style={styles.casaNumber}>{casa.numero}</Text>
                  <Text style={styles.casaSigno}>{casa.signo.simbolo}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedCasa !== null ? mapaAstral.casas.filter((c) => c.numero === selectedCasa).map((casa) => (
              <View key={casa.numero} style={styles.casaDetailBox}>
                <Text style={styles.casaDetailTitle}>{casa.nome}</Text>
                <Text style={styles.casaDetailSigno}>{translateSign(casa.signo.nome, t)} {casa.signo.simbolo}</Text>
                <Text style={styles.casaDetailText}>{casa.descricao}</Text>
                <Text style={styles.casaDetailTema}>{t('astralMap.theme')}: {casa.nome.split(' ')[1]}</Text>
              </View>
            )) : null}
          </View>
        ) : null}
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ {t('astralMap.aboutTitle')}</Text>
        <Text style={styles.infoText}>{t('astralMap.aboutText')}</Text>
      </View>
    </ScrollView>
  );
}

function translateSign(signName: string, t: (key: string) => string): string {
  const map: Record<string, string> = { Áries:'aries',Touro:'taurus',Gêmeos:'gemini',Câncer:'cancer',Leão:'leo',Virgem:'virgo',Libra:'libra',Escorpião:'scorpio',Sagitário:'sagittarius',Capricórnio:'capricorn',Aquário:'aquarius',Peixes:'pisces' };
  const key = map[signName];
  return key ? t(`signs.${key}`) : signName;
}
function translateSignMotto(signName: string, t: (key: string) => string): string {
  const map: Record<string, string> = { Áries:'aries',Touro:'taurus',Gêmeos:'gemini',Câncer:'cancer',Leão:'leo',Virgem:'virgo',Libra:'libra',Escorpião:'scorpio',Sagitário:'sagittarius',Capricórnio:'capricorn',Aquário:'aquarius',Peixes:'pisces' };
  const key = map[signName];
  return key ? t(`astralMap.signMottos.${key}`) : '';
}

function makeStyles(isLight: boolean) {
  const C = getColors(isLight);
  const cardBg   = isLight ? 'rgba(252,228,236,0.7)' : 'rgba(38,17,51,0.6)';
  const detailBg = isLight ? 'rgba(194,24,91,0.08)'  : 'rgba(228,195,38,0.08)';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.deepBlue },
    page: { padding: 18, paddingBottom: 56, backgroundColor: C.deepBlue },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { color: C.gold, fontSize: 28, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
    birthDate: { color: C.text, fontSize: 13, opacity: 0.8 },
    tripleAstrologicalGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    tripleCard: { flex: 1, borderWidth: 1.5, borderColor: C.gold, borderRadius: 14, padding: 14, backgroundColor: isLight ? 'rgba(194,24,91,0.1)' : 'rgba(228,195,38,0.1)', alignItems: 'center' },
    tripleLabel: { color: C.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
    tripleSigno: { color: C.gold, fontSize: 16, fontWeight: '800', marginBottom: 4 },
    tripleSymbol: { fontSize: 28, marginBottom: 6 },
    tripleDescricao: { color: C.text, fontSize: 11, textAlign: 'center', fontStyle: 'italic', lineHeight: 14 },
    expandableCard: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 16, padding: 16, marginBottom: 12, backgroundColor: cardBg },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { color: C.gold, fontSize: 15, fontWeight: '700', flex: 1 },
    toggleIcon: { color: C.gold, fontSize: 18, fontWeight: '700' },
    cardContent: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: C.panelBorder },
    descriptionText: { color: C.text, fontSize: 13, lineHeight: 20, marginBottom: 10 },
    elementRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.panelBorder },
    elementLabel: { color: C.gold, fontWeight: '700', fontSize: 13 },
    elementValue: { color: C.text, fontSize: 13 },
    casasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    casaCard: { width: '23%', aspectRatio: 1, borderWidth: 1, borderColor: C.panelBorder, borderRadius: 10, backgroundColor: isLight ? 'rgba(255,240,245,0.6)' : 'rgba(12,7,20,0.4)', justifyContent: 'center', alignItems: 'center' },
    casaCardSelected: { borderColor: C.gold, backgroundColor: isLight ? 'rgba(194,24,91,0.15)' : 'rgba(228,195,38,0.15)' },
    casaNumber: { color: C.gold, fontSize: 11, fontWeight: '700' },
    casaSigno: { fontSize: 16, marginTop: 4 },
    casaDetailBox: { backgroundColor: detailBg, borderWidth: 1, borderColor: C.panelBorder, borderRadius: 10, padding: 12 },
    casaDetailTitle: { color: C.gold, fontSize: 13, fontWeight: '700', marginBottom: 4 },
    casaDetailSigno: { color: C.text, fontSize: 12, marginBottom: 6 },
    casaDetailText: { color: C.text, fontSize: 12, lineHeight: 18, marginBottom: 6 },
    casaDetailTema: { color: C.gray, fontSize: 11 },
    signDescription: { marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.panelBorder },
    signTitle: { color: C.gold, fontSize: 14, fontWeight: '700', marginBottom: 6 },
    signText: { color: C.text, fontSize: 13, lineHeight: 20 },
    infoBox: { backgroundColor: detailBg, borderWidth: 1, borderColor: C.panelBorder, borderRadius: 12, padding: 14, marginTop: 14 },
    infoTitle: { color: C.gold, fontSize: 13, fontWeight: '700', marginBottom: 8 },
    infoText: { color: C.text, fontSize: 12, lineHeight: 18 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
    emptyStateText: { color: C.text, fontSize: 14, opacity: 0.6 },
  });
}