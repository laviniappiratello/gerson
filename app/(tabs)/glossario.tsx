import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { TAROT_CARDS } from '../../constants/OraculoData';
import { Colors, globalStyles as GStyles } from '../../src/styles/GlobalStyles';

export default function GlossarioScreen() {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.deepBlue }} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>✦ SIGNIFICADO DAS CARTAS ✦</Text>
      <Text style={GStyles.title}>Glossario dos Arcanos</Text>

      <View style={styles.block}>
        <Text style={styles.baseText}>Toque em uma carta para abrir ou fechar o significado.</Text>
      </View>

      {TAROT_CARDS.map((card) => {
        const open = selectedCardId === card.id;
        return (
          <View key={card.id} style={styles.block}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setSelectedCardId((current) => (current === card.id ? null : card.id))}
            >
              <Text style={styles.cardTitle}>{open ? '▾ ' : '▸ '}{card.nome}</Text>
            </TouchableOpacity>

            {open ? (
              <>
                <Image source={card.imagem} style={styles.cardImage} resizeMode="contain" />
                <Text style={styles.meaningTitle}>Significado (Normal)</Text>
                <Text style={styles.baseText}>{card.interpretacaoNormal}</Text>
                <Text style={styles.meaningTitle}>Significado (Invertida)</Text>
                <Text style={styles.baseText}>{card.interpretacaoInvertida}</Text>
              </>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 18,
    paddingBottom: 56,
    backgroundColor: Colors.deepBlue,
  },
  kicker: {
    color: Colors.gold,
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: 11,
    opacity: 0.9,
    marginTop: 6,
  },
  block: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    backgroundColor: 'rgba(38,17,51,0.82)',
  },
  cardHeader: {
    backgroundColor: 'transparent',
  },
  cardTitle: {
    color: Colors.gold,
    fontSize: 17,
    fontWeight: '700',
  },
  cardImage: {
    width: '100%',
    height: 180,
    marginTop: 10,
    marginBottom: 8,
  },
  meaningTitle: {
    color: Colors.gold,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 4,
  },
  baseText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
});