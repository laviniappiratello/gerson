import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { INFO_DECKS } from '../../constants/MisticoData';
import { CIGANO_CARDS, MARSELHA_CARDS, TAROT_CARDS_COMPLETO } from '../../constants/OraculoData';
import { Colors, globalStyles as GStyles } from '../../src/styles/GlobalStyles';

type DeckKey = keyof typeof INFO_DECKS;

type GlossaryCard = {
  id: string | number;
  nome: string;
  imagem: any;
  interpretacaoNormal?: string;
  interpretacaoInvertida?: string;
};

const DECKS: Array<{ id: DeckKey; cards: GlossaryCard[] }> = [
  {
    id: 'rider-waite',
    cards: TAROT_CARDS_COMPLETO,
  },
  {
    id: 'cigano',
    cards: CIGANO_CARDS,
  },
  {
    id: 'marselha',
    cards: MARSELHA_CARDS,
  },
];

export default function GlossarioScreen() {
  const [openDeckId, setOpenDeckId] = useState<DeckKey | null>(null);
  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.toLowerCase().trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.deepBlue }} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>✦ SIGNIFICADO DAS CARTAS ✦</Text>
      <Text style={GStyles.title}>Glossario dos Arcanos</Text>

      <View style={styles.searchBlock}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar carta..."
          placeholderTextColor="rgba(228,195,38,0.5)"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.block}>
        <Text style={styles.baseText}>Abra um baralho para ver as cartas e toque em uma carta para expandir os detalhes.</Text>
      </View>

      {DECKS.map((deck) => {
        const deckMeta = INFO_DECKS[deck.id];
        const deckOpen = openDeckId === deck.id;
        return (
          <View key={deck.id} style={styles.block}>
            <TouchableOpacity
              style={styles.deckHeader}
              onPress={() => setOpenDeckId((current) => (current === deck.id ? null : deck.id))}
            >
              <Text style={styles.cardTitle}>{deckOpen ? '▾ ' : '▸ '}{deckMeta.titulo}</Text>
              <Text style={styles.deckSubtitle}>{deckMeta.subtitulo}</Text>
            </TouchableOpacity>

            {deckOpen ? (
              <View style={styles.cardList}>
                {deck.cards
                  .filter((card) => {
                    if (!debouncedSearch) return true;
                    return card.nome.toLowerCase().includes(debouncedSearch);
                  })
                  .map((card) => {
                  const cardKey = `${deck.id}:${card.id}`;
                  const open = selectedCardKey === cardKey;

                  return (
                    <View key={cardKey} style={styles.cardItem}>
                      <TouchableOpacity
                        style={styles.cardHeader}
                        onPress={() => setSelectedCardKey((current) => (current === cardKey ? null : cardKey))}
                      >
                        <Text style={styles.cardTitle}>{open ? '▾ ' : '▸ '}{card.nome}</Text>
                      </TouchableOpacity>

                      {open ? (
                        <>
                          <Image source={card.imagem} style={styles.cardImage} resizeMode="contain" />
                          {card.interpretacaoNormal ? (
                            <>
                              <Text style={styles.meaningTitle}>Significado (Normal)</Text>
                              <Text style={styles.baseText}>{card.interpretacaoNormal}</Text>
                              <Text style={styles.meaningTitle}>Significado (Invertida)</Text>
                              <Text style={styles.baseText}>{card.interpretacaoInvertida}</Text>
                            </>
                          ) : (
                            <Text style={styles.baseText}>Carta disponível no baralho cigano.</Text>
                          )}
                        </>
                      ) : null}
                    </View>
                  );
                })}
                {deck.cards.filter((card) => card.nome.toLowerCase().includes(debouncedSearch)).length === 0 && debouncedSearch && (
                  <Text style={styles.noResults}>Nenhuma carta encontrada com "{debouncedSearch}"</Text>
                )}
              </View>
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
  searchBlock: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'rgba(18,8,25,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.4)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.gold,
    fontSize: 15,
    fontWeight: '500',
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
  deckHeader: {
    backgroundColor: 'transparent',
    gap: 4,
  },
  cardTitle: {
    color: Colors.gold,
    fontSize: 17,
    fontWeight: '700',
  },
  deckSubtitle: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.85,
  },
  cardList: {
    marginTop: 12,
    gap: 10,
  },
  cardItem: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.18)',
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(18,8,25,0.4)',
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
  noResults: {
    color: 'rgba(228,195,38,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});