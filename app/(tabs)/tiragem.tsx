import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { INFO_DECKS } from '../../constants/MisticoData';
import { CIGANO_CARDS, MARSELHA_CARDS, TAROT_CARDS_COMPLETO } from '../../constants/OraculoData';
import { useAuth } from '../../src/context/AuthContext';
import {
  addReading,
  getReadings,
  makeId,
  setReadingNote,
  toggleReadingFavorite,
  type CardDraw,
  type DeckId,
  type ReadingRecord,
} from '../../src/services/storage';
import { globalStyles as GStyles } from '../../src/styles/GlobalStyles';
import { tiragemScreenStyles as styles } from '../../src/styles/screens/TiragemScreenStyles';

export default function TiragemScreen() {
  const { user, isLoading } = useAuth();
  const [question, setQuestion] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<DeckId>('rider-waite');
  const [selectedCardCount, setSelectedCardCount] = useState(3);
  const [deckMenuOpen, setDeckMenuOpen] = useState(false);
  const [countMenuOpen, setCountMenuOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  const deckOptions: DeckId[] = ['rider-waite', 'cigano', 'marselha'];
  const countOptions = [1, 2, 3, 4, 5];
  const deckCards: Record<DeckId, typeof TAROT_CARDS_COMPLETO> = {
    'rider-waite': TAROT_CARDS_COMPLETO,
    cigano: CIGANO_CARDS,
    marselha: MARSELHA_CARDS,
  };
  const allCards = [...TAROT_CARDS_COMPLETO, ...CIGANO_CARDS, ...MARSELHA_CARDS];

  useEffect(() => {
    if (!user) {
      setReadings([]);
      return;
    }

    void (async () => {
      const storedReadings = await getReadings(user.id);

      setReadings(storedReadings);
    })();
  }, [user?.id]);

  useEffect(() => {
    if (!readings.length) {
      setSelectedReadingId(null);
      return;
    }

    setSelectedReadingId((current) =>
      current && readings.some((item) => item.id === current) ? current : null,
    );
  }, [readings]);

  const leituraSelecionada = readings.find((item) => item.id === selectedReadingId) ?? null;
  const selectedDeckTitle = INFO_DECKS[selectedDeckId].titulo;

  useEffect(() => {
    setNoteDraft(leituraSelecionada?.note ?? '');
  }, [leituraSelecionada?.id, leituraSelecionada?.note]);

  const formatCardLabel = (count: number) => (count === 1 ? '1 carta' : `${count} cartas`);

  const getDeckTitle = (deckId?: DeckId) => INFO_DECKS[deckId ?? 'rider-waite'].titulo;

  const getPositionLabel = (index: number) => {
    if (selectedCardCount === 3) {
      return ['Passado', 'Presente', 'Futuro'][index] ?? `Carta ${index + 1}`;
    }

    return `Carta ${index + 1}`;
  };

  const alternarFavorito = async (readingId: string) => {
    if (!user) return;

    const changed = await toggleReadingFavorite(user.id, readingId);
    if (!changed) return;

    const storedReadings = await getReadings(user.id);
    setReadings(storedReadings);
  };

  const salvarAnotacao = async () => {
    if (!user || !leituraSelecionada) return;

    const changed = await setReadingNote(user.id, leituraSelecionada.id, noteDraft);
    if (!changed) return;

    const storedReadings = await getReadings(user.id);
    setReadings(storedReadings);
  };

  const sortearCartas = (deckId: DeckId, amount: number): CardDraw[] => {
    const pool = [...deckCards[deckId]];
    const selected: CardDraw[] = [];

    for (let i = 0; i < amount; i += 1) {
      const idx = Math.floor(Math.random() * pool.length);
      const card = pool.splice(idx, 1)[0];

      selected.push({
        cardId: card.id,
        nome: card.nome,
        invertida: Math.random() < 0.5,
      });
    }

    return selected;
  };

  const fazerTiragem = async () => {
    if (!user) return;
    if (!question.trim()) return;

    setIsDrawing(true);

    const cards = sortearCartas(selectedDeckId, selectedCardCount);
    const reading: ReadingRecord = {
      id: makeId('reading'),
      userId: user.id,
      question: question.trim(),
      cards,
      deckId: selectedDeckId,
      cardCount: selectedCardCount,
      createdAt: Date.now(),
      favorite: false,
    };

    await addReading(reading);
    const storedReadings = await getReadings(user.id);
    setReadings(storedReadings);
    setQuestion('');
    setSelectedReadingId(reading.id);
    setHistoryOpen(true);
    setIsDrawing(false);
  };

  if (isLoading || !user) {
    return (
      <View style={GStyles.container}>
        <Text style={GStyles.title}>Carregando tiragem...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>✦ ORÁCULO</Text>
      <Text style={GStyles.title}>Tiragem Personalizada</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Pergunta para o Tarot</Text>
        <Text style={styles.selectorLabel}>Baralho</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setDeckMenuOpen((current) => !current);
            setCountMenuOpen(false);
          }}
        >
          <Text style={styles.dropdownTitle}>{deckMenuOpen ? '▴ ' : '▾ '}{selectedDeckTitle}</Text>
        </TouchableOpacity>

        {deckMenuOpen ? (
          <View style={styles.dropdownList}>
            {deckOptions.map((deckId) => (
              <TouchableOpacity
                key={deckId}
                style={[styles.dropdownItem, selectedDeckId === deckId ? styles.dropdownItemActive : null]}
                onPress={() => {
                  setSelectedDeckId(deckId);
                  setDeckMenuOpen(false);
                }}
              >
                <Text style={styles.dropdownItemTitle}>
                  {selectedDeckId === deckId ? '▾ ' : '▸ '}
                  {INFO_DECKS[deckId].titulo}
                </Text>
                <Text style={styles.dropdownItemText}>{INFO_DECKS[deckId].subtitulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={styles.selectorLabel}>Quantidade de cartas</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setCountMenuOpen((current) => !current);
            setDeckMenuOpen(false);
          }}
        >
          <Text style={styles.dropdownTitle}>{countMenuOpen ? '▴ ' : '▾ '}{formatCardLabel(selectedCardCount)}</Text>
        </TouchableOpacity>

        {countMenuOpen ? (
          <View style={styles.dropdownList}>
            {countOptions.map((count) => (
              <TouchableOpacity
                key={count}
                style={[styles.dropdownItem, selectedCardCount === count ? styles.dropdownItemActive : null]}
                onPress={() => {
                  setSelectedCardCount(count);
                  setCountMenuOpen(false);
                }}
              >
                <Text style={styles.dropdownItemTitle}>
                  {selectedCardCount === count ? '▾ ' : '▸ '}
                  {formatCardLabel(count)}
                </Text>
                <Text style={styles.dropdownItemText}>{count === 3 ? 'Passado, presente e futuro.' : 'Tiragem personalizada.'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Escreva sua pergunta"
          placeholderTextColor="#888"
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={GStyles.mainButton} onPress={fazerTiragem} disabled={isDrawing}>
          <Text style={GStyles.buttonText}>{isDrawing ? 'CONSULTANDO...' : `TIRAR ${formatCardLabel(selectedCardCount).toUpperCase()}`}</Text>
        </TouchableOpacity>
      </View>

      {leituraSelecionada ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Tiragem Atual</Text>
          <Text style={styles.questionText}>Pergunta: {leituraSelecionada.question}</Text>

          {leituraSelecionada.cards.map((card, index) => {
            const base = allCards.find((item) => item.id === card.cardId);
            if (!base) return null;

            const posicao = getPositionLabel(index);

            return (
              <View key={`${card.cardId}_${index}`} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {posicao}: {base.nome} {card.invertida ? '(Invertida)' : '(Normal)'}
                </Text>
                <Image
                  source={base.imagem}
                  style={[styles.readingCardImage, card.invertida ? { transform: [{ rotate: '180deg' }] } : null]}
                  resizeMode="contain"
                />
                <Text style={styles.baseText}>
                  {card.invertida ? base.interpretacaoInvertida : base.interpretacaoNormal}
                </Text>
              </View>
            );
          })}

          <View style={styles.noteBlock}>
            <Text style={styles.noteTitle}>Anotações pessoais</Text>
            <TextInput
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="Escreva sua leitura pessoal aqui..."
              placeholderTextColor="#888"
              style={styles.noteInput}
              multiline
            />
            <TouchableOpacity style={GStyles.mainButton} onPress={salvarAnotacao}>
              <Text style={GStyles.buttonText}>SALVAR ANOTAÇÃO</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.baseText}>Selecione uma tiragem para ver os detalhes.</Text>
        </View>
      )}

      {readings.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Historico de Tiragens</Text>

          <TouchableOpacity style={styles.dropdownButton} onPress={() => setHistoryOpen((prev) => !prev)}>
            <Text style={styles.dropdownTitle}>{historyOpen ? '▴ Fechar tiragens' : '▾ Abrir tiragens'}</Text>
          </TouchableOpacity>

          {historyOpen ? (
            <View style={styles.dropdownList}>
              {readings.some((item) => item.favorite) ? (
                <>
                  <TouchableOpacity
                    style={[styles.dropdownItem, styles.favoritesSectionButton]}
                    onPress={() => setFavoritesOpen((prev) => !prev)}
                  >
                    <Text style={styles.dropdownItemTitle}>
                      {favoritesOpen ? '▾ ' : '▸ '}
                      Tiragens Favoritas
                    </Text>
                  </TouchableOpacity>

                  {favoritesOpen ? (
                    <View style={styles.nestedDropdownList}>
                      {readings.filter((item) => item.favorite).map((item) => {
                        const label = `Tiragem ${readings.length - readings.indexOf(item)}`;
                        const cardsSummary = item.cards.map((card) => card.nome).join(' • ');
                        const active = item.id === leituraSelecionada?.id;

                        return (
                          <View key={item.id} style={[styles.dropdownItem, active ? styles.dropdownItemActive : null]}>
                            <View style={styles.dropdownItemHeader}>
                              <TouchableOpacity
                                style={styles.dropdownItemMain}
                                onPress={() => {
                                  setSelectedReadingId((current) => (current === item.id ? null : item.id));
                                }}
                              >
                                <Text style={styles.dropdownItemTitle}>
                                  {active ? '▾ ' : '▸ '}
                                  {label}
                                  {' • '}
                                  {getDeckTitle(item.deckId)}
                                  {' • '}
                                  {item.cardCount ?? item.cards.length} cartas
                                  {active ? ' • Selecionada' : ''}
                                </Text>
                                <Text style={styles.dropdownItemText}>{cardsSummary}</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => {
                                  void alternarFavorito(item.id);
                                }}
                                accessibilityRole="button"
                                accessibilityLabel={item.favorite ? 'Remover dos favoritos' : 'Favoritar leitura'}
                              >
                                <Text style={[styles.favoriteButtonText, item.favorite ? styles.favoriteButtonTextActive : null]}>
                                  {item.favorite ? '★' : '☆'}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            {item.favorite ? <Text style={styles.favoriteTag}>Favorita</Text> : null}
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </>
              ) : null}

              <Text style={styles.demaisTiragensSectionTitle}>Demais Tiragens</Text>

              {readings.filter((item) => !item.favorite).map((item, index) => {
                const label = `Tiragem ${readings.length - readings.indexOf(item)}`;
                const cardsSummary = item.cards.map((card) => card.nome).join(' • ');
                const active = item.id === leituraSelecionada?.id;

                return (
                  <View key={item.id} style={[styles.dropdownItem, active ? styles.dropdownItemActive : null]}>
                    <View style={styles.dropdownItemHeader}>
                      <TouchableOpacity
                        style={styles.dropdownItemMain}
                        onPress={() => {
                          setSelectedReadingId((current) => (current === item.id ? null : item.id));
                        }}
                      >
                        <Text style={styles.dropdownItemTitle}>
                          {active ? '▾ ' : '▸ '}
                          {label}
                          {' • '}
                          {getDeckTitle(item.deckId)}
                          {' • '}
                          {item.cardCount ?? item.cards.length} cartas
                          {active ? ' • Selecionada' : ''}
                        </Text>
                        <Text style={styles.dropdownItemText}>{cardsSummary}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => {
                          void alternarFavorito(item.id);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={item.favorite ? 'Remover dos favoritos' : 'Favoritar leitura'}
                      >
                        <Text style={[styles.favoriteButtonText, item.favorite ? styles.favoriteButtonTextActive : null]}>
                          {item.favorite ? '★' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {item.favorite ? <Text style={styles.favoriteTag}>Favorita</Text> : null}
                  </View>
                );
              })}
            </View>
          ) : null}

        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.baseText}>Ainda não há tiragens para este perfil.</Text>
        </View>
      )}
    </ScrollView>
  );
}