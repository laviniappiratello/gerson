import { Text } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { INFO_DECKS } from '../../constants/MisticoData';
import { CIGANO_CARDS, MARSELHA_CARDS, TAROT_CARDS_COMPLETO } from '../../constants/OraculoData';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useFavoriteCards } from '../../src/hooks/useFavoriteCards';
import { useTranslation } from '../../src/i18n/useTranslation';
import { makeGlobalStyles, getColors } from '../../src/styles/GlobalStyles';

type DeckKey = keyof typeof INFO_DECKS;
type GlossaryCard = { id: string | number; nome: string; imagem: any; interpretacaoNormal?: string; interpretacaoInvertida?: string };

const DECKS: Array<{ id: DeckKey; cards: GlossaryCard[] }> = [
  { id: 'rider-waite', cards: TAROT_CARDS_COMPLETO },
  { id: 'cigano', cards: CIGANO_CARDS },
  { id: 'marselha', cards: MARSELHA_CARDS },
];

export default function GlossarioScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isLight } = useTheme();
  const C = getColors(isLight);
  const GStyles = makeGlobalStyles(isLight);
  const styles = makeStyles(isLight);
  const { isFavorited, handleToggleFavorite } = useFavoriteCards(user?.id ?? null);
  const [openDeckId, setOpenDeckId] = useState<DeckKey | null>(null);
  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText.toLowerCase().trim()), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.deepBlue }} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>{t('glossary.kicker')}</Text>
      <Text style={GStyles.title}>{t('glossary.screenTitle')}</Text>

      <View style={styles.searchBlock}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('glossary.searchPlaceholder')}
          placeholderTextColor={isLight ? 'rgba(194,24,91,0.5)' : 'rgba(228,195,38,0.5)'}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <TouchableOpacity
        style={[styles.filterButton, showOnlyFavorites ? styles.filterButtonActive : null]}
        onPress={() => setShowOnlyFavorites((prev) => !prev)}
      >
        <Text style={[styles.filterButtonText, showOnlyFavorites ? styles.filterButtonTextActive : null]}>
          {showOnlyFavorites ? `★ ${t('glossary.onlyFavorites')}` : `☆ ${t('glossary.viewAll')}`}
        </Text>
      </TouchableOpacity>

      <View style={styles.block}>
        <Text style={styles.baseText}>{t('glossary.openDeckInstruction')}</Text>
      </View>

      {DECKS.map((deck) => {
        const deckMeta = INFO_DECKS[deck.id];
        const deckTitleMap: Record<DeckKey, string> = { 'rider-waite': t('decks.riderWaite'), cigano: t('decks.cigano'), marselha: t('decks.marselha') };
        const deckSubtitleMap: Record<DeckKey, string> = { 'rider-waite': t('decks.riderWaiteDesc'), cigano: t('decks.ciganoDesc'), marselha: t('decks.marselhaeDesc') };
        const deckOpen = openDeckId === deck.id;
        return (
          <View key={deck.id} style={styles.block}>
            <TouchableOpacity style={styles.deckHeader} onPress={() => setOpenDeckId((cur) => (cur === deck.id ? null : deck.id))}>
              <Text style={styles.cardTitle}>{deckOpen ? '▾ ' : '▸ '}{deckTitleMap[deck.id] ?? deckMeta.titulo}</Text>
              <Text style={styles.deckSubtitle}>{deckSubtitleMap[deck.id] ?? deckMeta.subtitulo}</Text>
            </TouchableOpacity>
            {deckOpen ? (
              <View style={styles.cardList}>
                {deck.cards
                  .filter((card) => {
                    if (showOnlyFavorites && !isFavorited(deck.id, card.id)) return false;
                    if (!debouncedSearch) return true;
                    return card.nome.toLowerCase().includes(debouncedSearch);
                  })
                  .map((card) => {
                    const cardKey = `${deck.id}:${card.id}`;
                    const open = selectedCardKey === cardKey;
                    return (
                      <View key={cardKey} style={styles.cardItem}>
                        <View style={styles.cardHeaderRow}>
                          <TouchableOpacity style={styles.cardHeader} onPress={() => setSelectedCardKey((cur) => (cur === cardKey ? null : cardKey))}>
                            <Text style={styles.cardTitle}>{open ? '▾ ' : '▸ '}{card.nome}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleFavorite(deck.id, card.id)}>
                            <Text style={[styles.favoriteIcon, isFavorited(deck.id, card.id) ? styles.favoriteIconActive : null]}>
                              {isFavorited(deck.id, card.id) ? '★' : '☆'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        {open ? (
                          <>
                            <Image source={card.imagem} style={styles.cardImage} resizeMode="contain" />
                            {card.interpretacaoNormal ? (
                              <>
                                <Text style={styles.meaningTitle}>{t('glossary.meaningNormal')}</Text>
                                <Text style={styles.baseText}>{card.interpretacaoNormal}</Text>
                                <Text style={styles.meaningTitle}>{t('glossary.meaningReversed')}</Text>
                                <Text style={styles.baseText}>{card.interpretacaoInvertida}</Text>
                              </>
                            ) : (
                              <Text style={styles.baseText}>{t('glossary.ciganoCardOnly')}</Text>
                            )}
                          </>
                        ) : null}
                      </View>
                    );
                  })}
                {deck.cards.filter((c) => c.nome.toLowerCase().includes(debouncedSearch)).length === 0 && debouncedSearch ? (
                  <Text style={styles.noResults}>{t('glossary.noResults', { query: debouncedSearch })}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

function makeStyles(isLight: boolean) {
  const C = getColors(isLight);
  const blockBg = isLight ? 'rgba(252,228,236,0.9)' : 'rgba(38,17,51,0.82)';
  return StyleSheet.create({
    page: { padding: 18, paddingBottom: 56, backgroundColor: C.deepBlue },
    searchBlock: { marginBottom: 16 },
    searchInput: {
      backgroundColor: isLight ? 'rgba(255,240,245,0.9)' : 'rgba(18,8,25,0.8)',
      borderWidth: 1,
      borderColor: C.panelBorder,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: C.gold,
      fontSize: 15,
      fontWeight: '500',
    },
    kicker: { color: C.gold, textAlign: 'center', letterSpacing: 1, fontSize: 11, opacity: 0.9, marginTop: 6 },
    block: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 18, padding: 14, marginBottom: 12, backgroundColor: blockBg },
    cardHeader: { backgroundColor: 'transparent', flex: 1 },
    cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    favoriteButton: { padding: 8, marginLeft: 8 },
    favoriteIcon: { fontSize: 20, color: isLight ? 'rgba(194,24,91,0.5)' : 'rgba(228,195,38,0.5)' },
    favoriteIconActive: { color: C.gold },
    deckHeader: { backgroundColor: 'transparent', gap: 4 },
    cardTitle: { color: C.gold, fontSize: 17, fontWeight: '700' },
    deckSubtitle: { color: C.text, fontSize: 13, lineHeight: 18, opacity: 0.85 },
    cardList: { marginTop: 12, gap: 10 },
    cardItem: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 14, padding: 12, backgroundColor: isLight ? 'rgba(255,240,245,0.7)' : 'rgba(18,8,25,0.4)' },
    cardImage: { width: '100%', height: 180, marginTop: 10, marginBottom: 8 },
    meaningTitle: { color: C.gold, fontWeight: '700', fontSize: 13, marginTop: 6, marginBottom: 4 },
    baseText: { color: C.text, fontSize: 14, lineHeight: 21 },
    noResults: { color: isLight ? 'rgba(194,24,91,0.6)' : 'rgba(228,195,38,0.6)', fontSize: 14, textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
    filterButton: { backgroundColor: isLight ? 'rgba(194,24,91,0.08)' : 'rgba(228,195,38,0.08)', borderWidth: 1, borderColor: C.panelBorder, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 14, alignItems: 'center' },
    filterButtonActive: { backgroundColor: isLight ? 'rgba(194,24,91,0.18)' : 'rgba(228,195,38,0.18)', borderColor: C.gold },
    filterButtonText: { color: isLight ? 'rgba(194,24,91,0.7)' : 'rgba(228,195,38,0.7)', fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
    filterButtonTextActive: { color: C.gold },
  });
}