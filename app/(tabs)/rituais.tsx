import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { CIGANO_CARDS, MARSELHA_CARDS, TAROT_CARDS_COMPLETO } from '../../constants/OraculoData';
import { useRituais } from '../../src/hooks/useRituais';
import { Colors } from '../../src/styles/GlobalStyles';

type RitualCardType = {
  id: string | number;
  nome: string;
  imagem: any;
};

const allCards: RitualCardType[] = [...TAROT_CARDS_COMPLETO, ...CIGANO_CARDS, ...MARSELHA_CARDS];

export default function RituaisScreen() {
  const { currentPhase, phaseInfo, rituaisPorFase } = useRituais();
  const [expandedRitualId, setExpandedRitualId] = useState<string | null>(null);
  const [completedRituais, setCompletedRituais] = useState<Set<string>>(new Set());

  const handleToggleRitual = (ritualId: string) => {
    setExpandedRitualId((current) => (current === ritualId ? null : ritualId));
  };

  const handleCompleteRitual = (ritualId: string) => {
    setCompletedRituais((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ritualId)) {
        newSet.delete(ritualId);
      } else {
        newSet.add(ritualId);
      }
      return newSet;
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      {/* Header com Fase Lunar */}
      {phaseInfo && (
        <View style={styles.lunarHeader}>
          <Text style={styles.lunarEmoji}>{phaseInfo.emoji}</Text>
          <Text style={styles.lunarTitle}>{phaseInfo.name}</Text>
          <Text style={styles.lunarDescription}>{phaseInfo.description}</Text>

          <View style={styles.lunarDetails}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Iluminação</Text>
              <Text style={styles.detailValue}>{phaseInfo.illumination}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Próxima Fase</Text>
              <Text style={styles.detailValue}>{phaseInfo.nextPhase === 'nova' ? '🌑' : '🌒'}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Data</Text>
              <Text style={styles.detailValue}>{phaseInfo.nextPhaseDate}</Text>
            </View>
          </View>

          <View style={styles.characteristicsBox}>
            <Text style={styles.characteristicsTitle}>Características desta fase:</Text>
            <View style={styles.characteristicsList}>
              {phaseInfo.characteristics.map((char, idx) => (
                <View key={idx} style={styles.characteristicTag}>
                  <Text style={styles.characteristicText}>✨ {char}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Lista de Rituais */}
      <Text style={styles.sectionTitle}>Rituais para esta fase</Text>

      {rituaisPorFase.length > 0 ? (
        rituaisPorFase.map((ritual) => {
          const isExpanded = expandedRitualId === ritual.id;
          const isCompleted = completedRituais.has(ritual.id);

          return (
            <View key={ritual.id} style={[styles.ritualCard, isExpanded && styles.ritualCardExpanded]}>
              {/* Header do Ritual */}
              <TouchableOpacity
                style={styles.ritualHeader}
                onPress={() => handleToggleRitual(ritual.id)}
              >
                <View style={styles.ritualHeaderLeft}>
                  <Text style={styles.ritualToggle}>{isExpanded ? '▾' : '▸'}</Text>
                  <View style={styles.ritualTitleContainer}>
                    <Text style={styles.ritualTitle}>{ritual.title}</Text>
                    <Text style={styles.ritualCategory}>{ritual.category}</Text>
                  </View>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(ritual.difficulty) }]}>
                  <Text style={styles.difficultyText}>{ritual.difficulty}</Text>
                </View>
              </TouchableOpacity>

              {/* Conteúdo expandido */}
              {isExpanded && (
                <View style={styles.ritualContent}>
                  {/* Descrição */}
                  <Text style={styles.ritualDescription}>{ritual.description}</Text>

                  {/* Info básicas */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoBadge}>
                      <Text style={styles.infoLabel}>⏱️ Duração</Text>
                      <Text style={styles.infoValue}>{ritual.duration}</Text>
                    </View>
                    <View style={styles.infoBadge}>
                      <Text style={styles.infoLabel}>📋 Passos</Text>
                      <Text style={styles.infoValue}>{ritual.steps.length}</Text>
                    </View>
                  </View>

                  {/* Materiais */}
                  <View style={styles.section}>
                    <Text style={styles.sectionSubtitle}>Materiais necessários</Text>
                    {ritual.materials.map((material, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <Text style={styles.listItemText}>• {material}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Passos do ritual */}
                  <View style={styles.section}>
                    <Text style={styles.sectionSubtitle}>Passos</Text>
                    {ritual.steps.map((step) => (
                      <View key={step.order} style={styles.stepBox}>
                        <View style={styles.stepHeader}>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{step.order}</Text>
                          </View>
                          <View style={styles.stepTitleContainer}>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                            {step.duration && <Text style={styles.stepDuration}>{step.duration}</Text>}
                          </View>
                        </View>
                        <Text style={styles.stepDescription}>{step.description}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Cartas sugeridas */}
                  {ritual.suggestedCards && ritual.suggestedCards.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionSubtitle}>Cartas Sugeridas</Text>
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
                  )}

                  {/* Benefícios */}
                  <View style={styles.section}>
                    <Text style={styles.sectionSubtitle}>Benefícios</Text>
                    {ritual.benefits.map((benefit, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <Text style={styles.listItemText}>✓ {benefit}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Afirmação */}
                  {ritual.affirmation && (
                    <View style={styles.affirmationBox}>
                      <Text style={styles.affirmationLabel}>Afirmação do Ritual</Text>
                      <Text style={styles.affirmationText}>"{ritual.affirmation}"</Text>
                    </View>
                  )}

                  {/* Botão de conclusão */}
                  <TouchableOpacity
                    style={[styles.completeButton, isCompleted && styles.completeButtonActive]}
                    onPress={() => handleCompleteRitual(ritual.id)}
                  >
                    <Text style={[styles.completeButtonText, isCompleted && styles.completeButtonTextActive]}>
                      {isCompleted ? '✓ Ritual Concluído' : 'Marcar como Concluído'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum ritual disponível para esta fase</Text>
        </View>
      )}

      {/* Resumo de Rituais Completados */}
      {completedRituais.size > 0 && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Rituais Completados</Text>
          <Text style={styles.summaryCount}>{completedRituais.size} de {rituaisPorFase.length}</Text>
          <Text style={styles.summaryText}>Parabéns! Continue na jornada espiritual!</Text>
        </View>
      )}
    </ScrollView>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'fácil':
      return 'rgba(76,175,80,0.3)';
    case 'moderado':
      return 'rgba(255,193,7,0.3)';
    case 'avançado':
      return 'rgba(244,67,54,0.3)';
    default:
      return 'rgba(228,195,38,0.3)';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.deepBlue },
  page: {
    padding: 18,
    paddingBottom: 100,
    backgroundColor: Colors.deepBlue,
  },
  lunarHeader: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(228,195,38,0.08)',
    alignItems: 'center',
  },
  lunarEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  lunarTitle: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  lunarDescription: {
    color: Colors.text,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  lunarDetails: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  detailBox: {
    flex: 1,
    backgroundColor: 'rgba(228,195,38,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  detailLabel: {
    color: 'rgba(228,195,38,0.7)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  characteristicsBox: {
    width: '100%',
    backgroundColor: 'rgba(12,7,20,0.6)',
    borderRadius: 12,
    padding: 14,
  },
  characteristicsTitle: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  characteristicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  characteristicTag: {
    backgroundColor: 'rgba(228,195,38,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  characteristicText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  ritualCard: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(38,17,51,0.6)',
    overflow: 'hidden',
  },
  ritualCardExpanded: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(38,17,51,0.9)',
  },
  ritualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  ritualHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ritualToggle: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '700',
  },
  ritualTitleContainer: {
    flex: 1,
  },
  ritualTitle: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: '700',
  },
  ritualCategory: {
    color: Colors.text,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  difficultyText: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  ritualContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  ritualDescription: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  infoBadge: {
    flex: 1,
    backgroundColor: 'rgba(228,195,38,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.18)',
    borderRadius: 10,
    padding: 12,
  },
  infoLabel: {
    color: 'rgba(228,195,38,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  infoValue: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listItem: {
    paddingVertical: 6,
  },
  listItemText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
  stepBox: {
    backgroundColor: 'rgba(12,7,20,0.4)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: Colors.deepBlue,
    fontSize: 14,
    fontWeight: '800',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  stepDuration: {
    color: 'rgba(228,195,38,0.6)',
    fontSize: 11,
    marginTop: 2,
  },
  stepDescription: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 19,
    marginLeft: 44,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardContainer: {
    width: '30%',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  cardName: {
    color: Colors.text,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  affirmationBox: {
    backgroundColor: 'rgba(228,195,38,0.1)',
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  affirmationLabel: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  affirmationText: {
    color: Colors.text,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 21,
  },
  completeButton: {
    backgroundColor: 'rgba(228,195,38,0.12)',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completeButtonActive: {
    backgroundColor: 'rgba(228,195,38,0.25)',
  },
  completeButtonText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  completeButtonTextActive: {
    color: Colors.gold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: Colors.text,
    fontSize: 14,
    opacity: 0.6,
  },
  summaryBox: {
    backgroundColor: 'rgba(228,195,38,0.12)',
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  summaryTitle: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryCount: {
    color: Colors.gold,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryText: {
    color: Colors.text,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
