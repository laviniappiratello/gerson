import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useMapaAstral } from '../../src/hooks/useMapaAstral';
import { useTranslation } from '../../src/i18n/useTranslation';
import { Colors, globalStyles as GStyles } from '../../src/styles/GlobalStyles';

export default function MapaAstralScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
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
      {/* Título e Data de Nascimento */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('astralMap.yourAstralMap')}</Text>
        <Text style={styles.birthDate}>
          {t('astralMap.bornOn')} {new Date(user.birthDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'pt-BR')}
        </Text>
      </View>

      {/* Tripla Astrológica - Destaque Principal */}
      <View style={styles.tripleAstrologicalGrid}>
        <View style={styles.tripleCard}>
          <Text style={styles.tripleLabel}>☀️ {t('astralMap.sunEgo')}</Text>
          <Text style={styles.tripleSigno}>{translateSign(mapaAstral.signoSolar.nome, t)}</Text>
          <Text style={styles.tripleSymbol}>{mapaAstral.signoSolar.simbolo}</Text>
          <Text style={styles.tripleDescricao}>{translateSignMotto(mapaAstral.signoSolar.nome, t)}</Text>
        </View>

        <View style={styles.tripleCard}>
          <Text style={styles.tripleLabel}>🌙 {t('astralMap.moonEmotion')}</Text>
          <Text style={styles.tripleSigno}>{translateSign(mapaAstral.signoLunar.nome, t)}</Text>
          <Text style={styles.tripleSymbol}>{mapaAstral.signoLunar.simbolo}</Text>
          <Text style={styles.tripleDescricao}>{translateSignMotto(mapaAstral.signoLunar.nome, t)}</Text>
        </View>

        <View style={styles.tripleCard}>
          <Text style={styles.tripleLabel}>⬆️ {t('astralMap.ascendant')}</Text>
          <Text style={styles.tripleSigno}>{translateSign(mapaAstral.ascendente.nome, t)}</Text>
          <Text style={styles.tripleSymbol}>{mapaAstral.ascendente.simbolo}</Text>
          <Text style={styles.tripleDescricao}>{t('astralMap.firstImpression')}</Text>
        </View>
      </View>{/*  */}

      {/* Descrição da Personalidade */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setExpandedSection(expandedSection === 'personalidade' ? null : 'personalidade')}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📊 {t('astralMap.personalitySection')}</Text>
          <Text style={styles.toggleIcon}>{expandedSection === 'personalidade' ? '▾' : '▸'}</Text>
        </View>

        {expandedSection === 'personalidade' && (
          <View style={styles.cardContent}>
            <Text style={styles.descriptionText}>{mapaAstral.personalidadeBaseada}</Text>
            <Text style={styles.descriptionText}>{mapaAstral.aparencia}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Elementos e Qualidades */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setExpandedSection(expandedSection === 'elementos' ? null : 'elementos')}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🔥 {t('astralMap.elementsSection')}</Text>
          <Text style={styles.toggleIcon}>{expandedSection === 'elementos' ? '▾' : '▸'}</Text>
        </View>

        {expandedSection === 'elementos' && (
          <View style={styles.cardContent}>
            <View style={styles.elementRow}>
              <Text style={styles.elementLabel}>{t('astralMap.sunLabel')}</Text>
              <Text style={styles.elementValue}>
                {mapaAstral.signoSolar.elemento} / {mapaAstral.signoSolar.qualidade}
              </Text>
            </View>
            <View style={styles.elementRow}>
              <Text style={styles.elementLabel}>{t('astralMap.moonLabel')}</Text>
              <Text style={styles.elementValue}>
                {mapaAstral.signoLunar.elemento} / {mapaAstral.signoLunar.qualidade}
              </Text>
            </View>
            <View style={styles.elementRow}>
              <Text style={styles.elementLabel}>{t('astralMap.ascendantLabel')}</Text>
              <Text style={styles.elementValue}>
                {mapaAstral.ascendente.elemento} / {mapaAstral.ascendente.qualidade}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Casas Astrológicas */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setExpandedSection(expandedSection === 'casas' ? null : 'casas')}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🏠 {t('astralMap.housesSection')}</Text>
          <Text style={styles.toggleIcon}>{expandedSection === 'casas' ? '▾' : '▸'}</Text>
        </View>

        {expandedSection === 'casas' && (
          <View style={styles.cardContent}>
            <View style={styles.casasGrid}>
              {mapaAstral.casas.map((casa) => (
                <TouchableOpacity
                  key={casa.numero}
                  style={[styles.casaCard, selectedCasa === casa.numero && styles.casaCardSelected]}
                  onPress={() => setSelectedCasa(selectedCasa === casa.numero ? null : casa.numero)}
                >
                  <Text style={styles.casaNumber}>{casa.numero}</Text>
                  <Text style={styles.casaSigno}>{casa.signo.simbolo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedCasa !== null && (
              <View style={styles.casaDetailBox}>
                {mapaAstral.casas
                  .filter((c) => c.numero === selectedCasa)
                  .map((casa) => (
                    <View key={casa.numero}>
                      <Text style={styles.casaDetailTitle}>{casa.nome}</Text>
                      <Text style={styles.casaDetailSigno}>
                        {translateSign(casa.signo.nome, t)} {casa.signo.simbolo}
                      </Text>
                      <Text style={styles.casaDetailText}>{casa.descricao}</Text>
                      <Text style={styles.casaDetailTema}>{t('astralMap.theme')}: {casa.nome.split(' ')[1]}</Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Compatibilidades */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setExpandedSection(expandedSection === 'compatibilidade' ? null : 'compatibilidade')}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>💕 {t('astralMap.compatibilitySection')}</Text>
          <Text style={styles.toggleIcon}>{expandedSection === 'compatibilidade' ? '▾' : '▸'}</Text>
        </View>

        {expandedSection === 'compatibilidade' && (
          <View style={styles.cardContent}>
            {mapaAstral.compatibilidades.map((compat, idx) => (
              <Text key={idx} style={styles.compatibilityText}>
                {compat}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Descrições dos Signos */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setExpandedSection(expandedSection === 'descricoes' ? null : 'descricoes')}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📖 {t('astralMap.signDescriptionsSection')}</Text>
          <Text style={styles.toggleIcon}>{expandedSection === 'descricoes' ? '▾' : '▸'}</Text>
        </View>

        {expandedSection === 'descricoes' && (
          <View style={styles.cardContent}>
            <View style={styles.signDescription}>
              <Text style={styles.signTitle}>☀️ {translateSign(mapaAstral.signoSolar.nome, t)}</Text>
              <Text style={styles.signText}>{mapaAstral.signoSolar.descricao}</Text>
            </View>

            <View style={styles.signDescription}>
              <Text style={styles.signTitle}>🌙 {translateSign(mapaAstral.signoLunar.nome, t)}</Text>
              <Text style={styles.signText}>{mapaAstral.signoLunar.descricao}</Text>
            </View>

            <View style={styles.signDescription}>
              <Text style={styles.signTitle}>⬆️ {translateSign(mapaAstral.ascendente.nome, t)}</Text>
              <Text style={styles.signText}>{mapaAstral.ascendente.descricao}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Nota Informativa */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ {t('astralMap.aboutTitle')}</Text>
        <Text style={styles.infoText}>
          {t('astralMap.aboutText')}
        </Text>
      </View>
    </ScrollView>
  );
}

function translateSign(signName: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    Áries: 'aries',
    Touro: 'taurus',
    Gêmeos: 'gemini',
    Câncer: 'cancer',
    Leão: 'leo',
    Virgem: 'virgo',
    Libra: 'libra',
    Escorpião: 'scorpio',
    Sagitário: 'sagittarius',
    Capricórnio: 'capricorn',
    Aquário: 'aquarius',
    Peixes: 'pisces',
  };
  const key = map[signName];
  return key ? t(`signs.${key}`) : signName;
}

function translateSignMotto(signName: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    Áries: 'aries',
    Touro: 'taurus',
    Gêmeos: 'gemini',
    Câncer: 'cancer',
    Leão: 'leo',
    Virgem: 'virgo',
    Libra: 'libra',
    Escorpião: 'scorpio',
    Sagitário: 'sagittarius',
    Capricórnio: 'capricorn',
    Aquário: 'aquarius',
    Peixes: 'pisces',
  };
  const key = map[signName];
  return key ? t(`astralMap.signMottos.${key}`) : '';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.deepBlue },
  page: {
    padding: 18,
    paddingBottom: 56,
    backgroundColor: Colors.deepBlue,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  birthDate: {
    color: Colors.text,
    fontSize: 13,
    opacity: 0.8,
  },
  tripleAstrologicalGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  tripleCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'rgba(228,195,38,0.1)',
    alignItems: 'center',
  },
  tripleLabel: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tripleSigno: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  tripleSymbol: {
    fontSize: 28,
    marginBottom: 6,
  },
  tripleDescricao: {
    color: Colors.text,
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 14,
  },
  expandableCard: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(38,17,51,0.6)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  toggleIcon: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '700',
  },
  cardContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(228,195,38,0.18)',
  },
  descriptionText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  elementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228,195,38,0.12)',
  },
  elementLabel: {
    color: Colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  elementValue: {
    color: Colors.text,
    fontSize: 13,
  },
  casasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  casaCard: {
    width: '23%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    borderRadius: 10,
    backgroundColor: 'rgba(12,7,20,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  casaCardSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(228,195,38,0.15)',
  },
  casaNumber: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  casaSigno: {
    fontSize: 16,
    marginTop: 4,
  },
  casaDetailBox: {
    backgroundColor: 'rgba(228,195,38,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.18)',
    borderRadius: 10,
    padding: 12,
  },
  casaDetailTitle: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  casaDetailSigno: {
    color: Colors.text,
    fontSize: 12,
    marginBottom: 6,
  },
  casaDetailText: {
    color: Colors.text,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  casaDetailTema: {
    color: 'rgba(228,195,38,0.6)',
    fontSize: 11,
  },
  compatibilityText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  signDescription: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228,195,38,0.12)',
  },
  signTitle: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  signText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: 'rgba(228,195,38,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.18)',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  infoTitle: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: Colors.text,
    fontSize: 14,
    opacity: 0.6,
  },
});
