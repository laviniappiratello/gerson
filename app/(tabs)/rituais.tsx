import { Text } from '@/components/Themed';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CIGANO_CARDS, MARSELHA_CARDS, TAROT_CARDS_COMPLETO } from '../../constants/OraculoData';
import { useTheme } from '../../src/context/ThemeContext';
import { useRituais } from '../../src/hooks/useRituais';
import { useTranslation } from '../../src/i18n/useTranslation';
import { getColors } from '../../src/styles/GlobalStyles';

type RitualCardType = { id: string | number; nome: string; imagem: any };
const allCards: RitualCardType[] = [...TAROT_CARDS_COMPLETO, ...CIGANO_CARDS, ...MARSELHA_CARDS];

export default function RituaisScreen() {
  const { t } = useTranslation();
  const { isLight } = useTheme();
  const styles = makeStyles(isLight);
  const C = getColors(isLight);
  const { phaseInfo, rituaisPorFase } = useRituais();
  const [expandedRitualId, setExpandedRitualId] = useState<string | null>(null);
  const [completedRituais, setCompletedRituais] = useState<Set<string>>(new Set());

  const translatedPhaseName = phaseInfo ? translateLunarPhaseName(phaseInfo.phase, t, phaseInfo.name) : '';
  const translatedPhaseDescription = phaseInfo ? translateLunarPhaseDescription(phaseInfo.phase, t, phaseInfo.description) : '';

  const handleToggleRitual = (id: string) => setExpandedRitualId((cur) => (cur === id ? null : id));
  const handleCompleteRitual = (id: string) => {
    setCompletedRituais((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      {phaseInfo ? (
        <View style={styles.lunarHeader}>
          <Text style={styles.lunarEmoji}>{phaseInfo.emoji}</Text>
          <Text style={styles.lunarTitle}>{translatedPhaseName}</Text>
          <Text style={styles.lunarDescription}>{translatedPhaseDescription}</Text>
          <View style={styles.lunarDetails}>
            <View style={styles.detailBox}><Text style={styles.detailLabel}>{t('rituals.illumination')}</Text><Text style={styles.detailValue}>{phaseInfo.illumination}</Text></View>
            <View style={styles.detailBox}><Text style={styles.detailLabel}>{t('rituals.nextPhase')}</Text><Text style={styles.detailValue}>{getLunarPhaseEmoji(phaseInfo.nextPhase)}</Text></View>
            <View style={styles.detailBox}><Text style={styles.detailLabel}>{t('rituals.date')}</Text><Text style={styles.detailValue}>{phaseInfo.nextPhaseDate}</Text></View>
          </View>
          <View style={styles.characteristicsBox}>
            <Text style={styles.characteristicsTitle}>{t('rituals.phaseCharacteristics')}</Text>
            <View style={styles.characteristicsList}>
              {phaseInfo.characteristics.map((char, idx) => (
                <View key={idx} style={styles.characteristicTag}>
                  <Text style={styles.characteristicText}>✨ {translateCharacteristic(char, t)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>{t('rituals.forThisPhase')}</Text>

      {rituaisPorFase.length > 0 ? rituaisPorFase.map((ritual) => {
        const isExpanded = expandedRitualId === ritual.id;
        const isCompleted = completedRituais.has(ritual.id);
        return (
          <View key={ritual.id} style={[styles.ritualCard, isExpanded ? styles.ritualCardExpanded : null]}>
            <TouchableOpacity style={styles.ritualHeader} onPress={() => handleToggleRitual(ritual.id)}>
              <View style={styles.ritualHeaderLeft}>
                <Text style={styles.ritualToggle}>{isExpanded ? '▾' : '▸'}</Text>
                <View style={styles.ritualTitleContainer}>
                  <Text style={styles.ritualTitle}>{ritual.title}</Text>
                  <Text style={styles.ritualCategory}>{ritual.category}</Text>
                </View>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(ritual.difficulty) }]}>
                <Text style={styles.difficultyText}>{translateDifficulty(ritual.difficulty, t)}</Text>
              </View>
            </TouchableOpacity>

            {isExpanded ? (
              <View style={styles.ritualContent}>
                <Text style={styles.ritualDescription}>{ritual.description}</Text>
                <View style={styles.infoRow}>
                  <View style={styles.infoBadge}><Text style={styles.infoLabel}>⏱️ {t('rituals.duration')}</Text><Text style={styles.infoValue}>{ritual.duration}</Text></View>
                  <View style={styles.infoBadge}><Text style={styles.infoLabel}>📋 {t('rituals.stepCount')}</Text><Text style={styles.infoValue}>{ritual.steps.length}</Text></View>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionSubtitle}>{t('rituals.materials')}</Text>
                  {ritual.materials.map((m, i) => <View key={i} style={styles.listItem}><Text style={styles.listItemText}>• {m}</Text></View>)}
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionSubtitle}>{t('rituals.steps')}</Text>
                  {ritual.steps.map((step) => (
                    <View key={step.order} style={styles.stepBox}>
                      <View style={styles.stepHeader}>
                        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{step.order}</Text></View>
                        <View style={styles.stepTitleContainer}>
                          <Text style={styles.stepTitle}>{step.title}</Text>
                          {step.duration ? <Text style={styles.stepDuration}>{step.duration}</Text> : null}
                        </View>
                      </View>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                  ))}
                </View>
                {ritual.suggestedCards && ritual.suggestedCards.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionSubtitle}>{t('rituals.suggestedCards')}</Text>
                    <View style={styles.cardsGrid}>
                      {ritual.suggestedCards.map((cardId) => {
                        const card = allCards.find((c) => c.id === cardId);
                        return card ? (
                          <View key={cardId} style={styles.cardContainer}>
                            <Image source={card.imagem} style={styles.cardImage} resizeMode="contain" />
                            <Text style={styles.cardName}>{card.nome}</Text>
                          </View>
                        ) : null;
                      })}
                    </View>
                  </View>
                ) : null}
                <View style={styles.section}>
                  <Text style={styles.sectionSubtitle}>{t('rituals.benefits')}</Text>
                  {ritual.benefits.map((b, i) => <View key={i} style={styles.listItem}><Text style={styles.listItemText}>✓ {b}</Text></View>)}
                </View>
                {ritual.affirmation ? (
                  <View style={styles.affirmationBox}>
                    <Text style={styles.affirmationLabel}>{t('rituals.ritualAffirmation')}</Text>
                    <Text style={styles.affirmationText}>"{ritual.affirmation}"</Text>
                  </View>
                ) : null}
                <TouchableOpacity style={[styles.completeButton, isCompleted ? styles.completeButtonActive : null]} onPress={() => handleCompleteRitual(ritual.id)}>
                  <Text style={styles.completeButtonText}>{isCompleted ? t('rituals.ritualCompleted') : t('rituals.completeRitual')}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        );
      }) : (
        <View style={styles.emptyState}><Text style={styles.emptyStateText}>{t('rituals.noPhaseRituals')}</Text></View>
      )}

      {completedRituais.size > 0 ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>{t('rituals.completedRituals')}</Text>
          <Text style={styles.summaryCount}>{completedRituais.size} de {rituaisPorFase.length}</Text>
          <Text style={styles.summaryText}>{t('rituals.summaryMessage')}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function translateDifficulty(d: string, t: (k: string) => string) {
  const n = d.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (n === 'facil') return t('rituals.difficulty.easy');
  if (n === 'moderado') return t('rituals.difficulty.moderate');
  if (n === 'avancado') return t('rituals.difficulty.advanced');
  return d;
}
function getLunarPhaseKey(phase: string): 'new'|'waxing'|'full'|'waning'|null {
  const n = phase.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  if (n === 'nova' || n === 'new') return 'new';
  if (n === 'crescente' || n === 'waxing') return 'waxing';
  if (n === 'cheia' || n === 'full') return 'full';
  if (n === 'minguante' || n === 'waning') return 'waning';
  return null;
}
function getLunarPhaseEmoji(phase: string) {
  const k = getLunarPhaseKey(phase);
  if (k === 'new') return '🌑'; if (k === 'waxing') return '🌒'; if (k === 'full') return '🌕'; if (k === 'waning') return '🌘';
  return '🌙';
}
function translateLunarPhaseName(phase: string, t: (k: string) => string, fallback: string) { const k = getLunarPhaseKey(phase); return k ? t(`lunarPhases.${k}.name`) : fallback; }
function translateLunarPhaseDescription(phase: string, t: (k: string) => string, fallback: string) { const k = getLunarPhaseKey(phase); return k ? t(`lunarPhases.${k}.desc`) : fallback; }
function translateCharacteristic(value: string, t: (k: string) => string) {
  const n = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  if (n === 'finalizacoes') return t('rituals.phaseExamples.closure');
  if (n === 'limpeza energetica') return t('rituals.phaseExamples.energeticCleansing');
  if (n === 'liberacao') return t('rituals.phaseExamples.release');
  if (n === 'organizacao') return t('rituals.phaseExamples.organization');
  if (n === 'reflexao') return t('rituals.phaseExamples.reflection');
  return value;
}
function getDifficultyColor(d: string) {
  switch (d) { case 'fácil': return 'rgba(76,175,80,0.3)'; case 'moderado': return 'rgba(255,193,7,0.3)'; case 'avançado': return 'rgba(244,67,54,0.3)'; default: return 'rgba(228,195,38,0.3)'; }
}

function makeStyles(isLight: boolean) {
  const C = getColors(isLight);
  const cardBg   = isLight ? 'rgba(252,228,236,0.7)' : 'rgba(38,17,51,0.6)';
  const detailBg = isLight ? 'rgba(194,24,91,0.08)'  : 'rgba(228,195,38,0.08)';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.deepBlue },
    page: { padding: 18, paddingBottom: 100, backgroundColor: C.deepBlue },
    lunarHeader: { borderWidth: 1.5, borderColor: C.gold, borderRadius: 20, padding: 20, marginBottom: 24, backgroundColor: detailBg, alignItems: 'center' },
    lunarEmoji: { fontSize: 60, marginBottom: 12 },
    lunarTitle: { color: C.gold, fontSize: 28, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
    lunarDescription: { color: C.text, fontSize: 15, textAlign: 'center', marginBottom: 16, lineHeight: 22 },
    lunarDetails: { width: '100%', flexDirection: 'row', gap: 10, marginBottom: 16 },
    detailBox: { flex: 1, backgroundColor: isLight ? 'rgba(194,24,91,0.12)' : 'rgba(228,195,38,0.12)', borderWidth: 1, borderColor: C.panelBorder, borderRadius: 12, padding: 10, alignItems: 'center' },
    detailLabel: { color: C.gray, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    detailValue: { color: C.gold, fontSize: 16, fontWeight: '800', marginTop: 4 },
    characteristicsBox: { width: '100%', backgroundColor: isLight ? 'rgba(255,240,245,0.8)' : 'rgba(12,7,20,0.6)', borderRadius: 12, padding: 14 },
    characteristicsTitle: { color: C.gold, fontSize: 13, fontWeight: '700', marginBottom: 10 },
    characteristicsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    characteristicTag: { backgroundColor: isLight ? 'rgba(194,24,91,0.15)' : 'rgba(228,195,38,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
    characteristicText: { color: C.text, fontSize: 12, fontWeight: '500' },
    sectionTitle: { color: C.gold, fontSize: 18, fontWeight: '800', marginBottom: 14, letterSpacing: 0.5 },
    ritualCard: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 16, marginBottom: 12, backgroundColor: cardBg, overflow: 'hidden' },
    ritualCardExpanded: { borderColor: C.gold, backgroundColor: isLight ? 'rgba(252,228,236,0.95)' : 'rgba(38,17,51,0.9)' },
    ritualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'transparent' },
    ritualHeaderLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
    ritualToggle: { color: C.gold, fontSize: 18, fontWeight: '700' },
    ritualTitleContainer: { flex: 1 },
    ritualTitle: { color: C.gold, fontSize: 15, fontWeight: '700' },
    ritualCategory: { color: C.text, fontSize: 12, marginTop: 2, opacity: 0.8 },
    difficultyBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.gold },
    difficultyText: { color: C.gold, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
    ritualContent: { paddingHorizontal: 16, paddingBottom: 16 },
    ritualDescription: { color: C.text, fontSize: 14, lineHeight: 21, marginBottom: 14 },
    infoRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    infoBadge: { flex: 1, backgroundColor: detailBg, borderWidth: 1, borderColor: C.panelBorder, borderRadius: 10, padding: 12 },
    infoLabel: { color: C.gray, fontSize: 11, fontWeight: '600' },
    infoValue: { color: C.gold, fontSize: 16, fontWeight: '800', marginTop: 4 },
    section: { marginBottom: 16 },
    sectionSubtitle: { color: C.gold, fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    listItem: { paddingVertical: 6 },
    listItemText: { color: C.text, fontSize: 13, lineHeight: 20 },
    stepBox: { backgroundColor: isLight ? 'rgba(255,240,245,0.6)' : 'rgba(12,7,20,0.4)', borderLeftWidth: 3, borderLeftColor: C.gold, borderRadius: 8, padding: 12, marginBottom: 10 },
    stepHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
    stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.gold, justifyContent: 'center', alignItems: 'center' },
    stepNumberText: { color: isLight ? '#fff' : C.deepBlue, fontSize: 14, fontWeight: '800' },
    stepTitleContainer: { flex: 1 },
    stepTitle: { color: C.gold, fontSize: 13, fontWeight: '700' },
    stepDuration: { color: C.gray, fontSize: 11, marginTop: 2 },
    stepDescription: { color: C.text, fontSize: 13, lineHeight: 19, marginLeft: 44 },
    cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    cardContainer: { width: '30%', alignItems: 'center' },
    cardImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 6 },
    cardName: { color: C.text, fontSize: 11, textAlign: 'center', lineHeight: 14 },
    affirmationBox: { backgroundColor: detailBg, borderLeftWidth: 4, borderLeftColor: C.gold, borderRadius: 12, padding: 14, marginBottom: 16 },
    affirmationLabel: { color: C.gold, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    affirmationText: { color: C.text, fontSize: 14, fontStyle: 'italic', lineHeight: 21 },
    completeButton: { backgroundColor: detailBg, borderWidth: 1.5, borderColor: C.gold, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    completeButtonActive: { backgroundColor: isLight ? 'rgba(194,24,91,0.25)' : 'rgba(228,195,38,0.25)' },
    completeButtonText: { color: C.gold, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
    emptyState: { alignItems: 'center', paddingVertical: 40 },
    emptyStateText: { color: C.text, fontSize: 14, opacity: 0.6 },
    summaryBox: { backgroundColor: detailBg, borderWidth: 1, borderColor: C.gold, borderRadius: 16, padding: 16, marginTop: 20, alignItems: 'center' },
    summaryTitle: { color: C.gold, fontSize: 14, fontWeight: '700', marginBottom: 8 },
    summaryCount: { color: C.gold, fontSize: 24, fontWeight: '800', marginBottom: 4 },
    summaryText: { color: C.text, fontSize: 13, fontStyle: 'italic' },
  });
}