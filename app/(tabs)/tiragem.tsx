import { Text, View } from '@/components/Themed';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Alert, Image, View as NativeView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { INFO_DECKS } from '../../constants/MisticoData';
import { CIGANO_CARDS, MARSELHA_CARDS, TAROT_CARDS_COMPLETO, type SignoNome } from '../../constants/OraculoData';
import { useAuth } from '../../src/context/AuthContext';
import { useTranslation } from '../../src/i18n/useTranslation';
import {
    addReading,
    addThirdPartyReading,
    getReadings,
    getThirdPartyReadings,
    makeId,
    setReadingNote,
    toggleReadingFavorite,
    type CardDraw,
    type DeckId,
    type ReadingRecord,
    type ThirdPartyReadingRecord,
} from '../../src/services/storage';
import { globalStyles as GStyles } from '../../src/styles/GlobalStyles';
import { tiragemScreenStyles as styles } from '../../src/styles/screens/TiragemScreenStyles';

const SIGNOS: SignoNome[] = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes',
];

export default function TiragemScreen() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const personalReadingRef = useRef<any>(null);
  const thirdPartyReadingRef = useRef<any>(null);

  // Modo
  const [modo, setModo] = useState<'meu' | 'terceiros'>('meu');

  // Estados para "Meu"
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

  // Estados para "Terceiros"
  const [terceiros, setTerceiros] = useState<ThirdPartyReadingRecord[]>([]);
  const [nomeOutraPessoa, setNomeOutraPessoa] = useState('');
  const [signoOutraPessoa, setSignoOutraPessoa] = useState<SignoNome>('Áries');
  const [questionTerceiros, setQuestionTerceiros] = useState('');
  const [isDrawingTerceiros, setIsDrawingTerceiros] = useState(false);
  const [selectedReadingIdTerceiros, setSelectedReadingIdTerceiros] = useState<string | null>(null);
  const [historyOpenTerceiros, setHistoryOpenTerceiros] = useState(false);
  const [selectedDeckIdTerceiros, setSelectedDeckIdTerceiros] = useState<DeckId>('rider-waite');
  const [selectedCardCountTerceiros, setSelectedCardCountTerceiros] = useState(3);
  const [deckMenuOpenTerceiros, setDeckMenuOpenTerceiros] = useState(false);
  const [countMenuOpenTerceiros, setCountMenuOpenTerceiros] = useState(false);
  const [signoMenuOpen, setSignoMenuOpen] = useState(false);

  const deckOptions: DeckId[] = ['rider-waite', 'cigano', 'marselha'];
  const countOptions = [1, 2, 3, 4, 5];
  const deckCards: Record<DeckId, typeof TAROT_CARDS_COMPLETO> = {
    'rider-waite': TAROT_CARDS_COMPLETO,
    cigano: CIGANO_CARDS,
    marselha: MARSELHA_CARDS,
  };
  const allCards = [...TAROT_CARDS_COMPLETO, ...CIGANO_CARDS, ...MARSELHA_CARDS];

  // Selecionadas
  const leituraSelecionada = readings.find((item) => item.id === selectedReadingId) ?? null;
  const leituraSelecionadaTerceiros = terceiros.find((item) => item.id === selectedReadingIdTerceiros) ?? null;

  // Load inicial
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
    void carregarTerceiros();
  }, []);

  useEffect(() => {
    if (!readings.length) {
      setSelectedReadingId(null);
      return;
    }

    setSelectedReadingId((current) =>
      current && readings.some((item) => item.id === current) ? current : null,
    );
  }, [readings]);

  useEffect(() => {
    setNoteDraft(leituraSelecionada?.note ?? '');
  }, [leituraSelecionada?.id, leituraSelecionada?.note]);

  const carregarTerceiros = async () => {
    const storedReadings = await getThirdPartyReadings();
    setTerceiros(storedReadings);
  };

  const formatCardLabel = (count: number) => (count === 1 ? `1 ${t('tiragem.card')}` : `${count} cartas`);
  const getDeckTitle = (deckId?: DeckId) => {
    const id = deckId ?? 'rider-waite';
    switch (id) {
      case 'rider-waite':
        return t('decks.riderWaite');
      case 'cigano':
        return t('decks.cigano');
      case 'marselha':
        return t('decks.marselha');
      default:
        return INFO_DECKS['rider-waite'].titulo;
    }
  };
  const getDeckSubtitle = (deckId?: DeckId) => {
    const id = deckId ?? 'rider-waite';
    switch (id) {
      case 'rider-waite':
        return t('decks.riderWaiteDesc');
      case 'cigano':
        return t('decks.ciganoDesc');
      case 'marselha':
        return t('decks.marselhaeDesc');
      default:
        return INFO_DECKS['rider-waite'].subtitulo;
    }
  };
  const translateSign = (signName: SignoNome) => {
    const map: Record<SignoNome, string> = {
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
    return t(`signs.${map[signName]}`);
  };

  const getPositionLabel = (index: number, cardCount?: number) => {
    const count = cardCount ?? 3;
    if (count === 3) {
      const positions = [t('tiragem.past'), t('tiragem.present'), t('tiragem.future')];
      return positions[index] ?? `${t('tiragem.card')} ${index + 1}`;
    }
    return `${t('tiragem.card')} ${index + 1}`;
  };
  const selectedDeckTitle = getDeckTitle(selectedDeckId);
  const selectedDeckTitleTerceiros = getDeckTitle(selectedDeckIdTerceiros);

  const downloadWebImage = async (dataUrl: string, filename: string) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  };

  // FIX: ref tipado corretamente como RefObject<NativeView>
  const compartilharImagem = async (targetRef: RefObject<any>, titulo: string) => {
    try {
      // FIX: checa se o ref está montado antes de capturar
      if (!targetRef.current) {
        Alert.alert(t('common.error'), t('tiragem.shareError'));
        return;
      }

      if (Platform.OS === 'web') {
        const base64 = await captureRef(targetRef, {
          format: 'png',
          quality: 1,
          result: 'base64',
        });

        const safeTitle = titulo.replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
        await downloadWebImage(`data:image/png;base64,${base64}`, `${safeTitle || 'reading'}.png`);
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(t('common.warning'), t('tiragem.shareUnavailable'));
        return;
      }

      const uri = await captureRef(targetRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: titulo,
        UTI: 'public.png',
      });
    } catch (err) {
      console.error('[compartilharImagem] erro:', err);
      Alert.alert(t('common.error'), t('tiragem.shareError'));
    }
  };

  // Funções "Meu"
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

  // Funções "Terceiros"
  const fazerTiragemTerceiros = async () => {
    if (!nomeOutraPessoa.trim()) {
      alert(t('tiragem.enterPersonName'));
      return;
    }
    if (!questionTerceiros.trim()) {
      alert(t('tiragem.question'));
      return;
    }

    setIsDrawingTerceiros(true);

    const cards = sortearCartas(selectedDeckIdTerceiros, selectedCardCountTerceiros);
    const reading: ThirdPartyReadingRecord = {
      id: makeId('reading'),
      pessoaNome: nomeOutraPessoa.trim(),
      pessoaSigno: signoOutraPessoa,
      question: questionTerceiros.trim(),
      cards,
      deckId: selectedDeckIdTerceiros,
      cardCount: selectedCardCountTerceiros,
      createdAt: Date.now(),
    };

    await addThirdPartyReading(reading);
    await carregarTerceiros();
    setQuestionTerceiros('');
    setSelectedReadingIdTerceiros(reading.id);
    setHistoryOpenTerceiros(true);
    setIsDrawingTerceiros(false);
  };

  if (isLoading || !user) {
    return (
      <View style={GStyles.container}>
        <Text style={GStyles.title}>Carregando tiragem...</Text>
      </View>
    );
  }

  // MODO MEU
  if (modo === 'meu') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.page}>
        <Text style={styles.kicker}>✦ ORÁCULO</Text>
        <Text style={GStyles.title}>Tiragem Personalizada</Text>

        <TouchableOpacity
          style={[GStyles.mainButton, { marginBottom: 20 }]}
          onPress={() => {
            setModo('terceiros');
            setNomeOutraPessoa('');
            setSignoOutraPessoa('Áries');
            setQuestionTerceiros('');
          }}
        >
          <Text style={GStyles.buttonText}>{t('tiragem.drawForMe')}</Text>
        </TouchableOpacity>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t('tiragem.title')}</Text>
          <Text style={styles.selectorLabel}>{t('tiragem.selectDeck')}</Text>
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
                    {getDeckTitle(deckId)}
                  </Text>
                  <Text style={styles.dropdownItemText}>{getDeckSubtitle(deckId)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <Text style={styles.selectorLabel}>{t('tiragem.selectCardCount')}</Text>
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
                  <Text style={styles.dropdownItemText}>{count === 3 ? t('tiragem.pastPresentFuture') : t('tiragem.customDraw')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={t('tiragem.question')}
            placeholderTextColor="#888"
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={GStyles.mainButton} onPress={fazerTiragem} disabled={isDrawing}>
            <Text style={GStyles.buttonText}>{isDrawing ? t('tiragem.drawing') : t('tiragem.draw', { count: formatCardLabel(selectedCardCount).toUpperCase() })}</Text>
          </TouchableOpacity>
        </View>

        {leituraSelecionada ? (
          <View style={styles.block}>
            {/*
              FIX: NativeView (View do React Native puro) com ref diretamente na raiz do bloco
              capturável, sem wrapper do Themed envolvendo. backgroundColor obrigatório para
              captureRef não gerar imagem transparente/falhar no Android.
            */}
            <NativeView
              ref={personalReadingRef}
              collapsable={false}
              style={{ backgroundColor: (styles.block as any)?.backgroundColor ?? '#1a1025' }}
            >
              <Text style={styles.blockTitle}>{t('tiragem.title')}</Text>
              <Text style={styles.questionText}>{t('tiragem.question_label')}: {leituraSelecionada.question}</Text>

              {leituraSelecionada.cards.map((card, index) => {
                const base = allCards.find((item) => item.id === card.cardId);
                if (!base) return null;

                const posicao = getPositionLabel(index, leituraSelecionada.cardCount ?? selectedCardCount);

                return (
                  // FIX: usar NativeView aqui dentro também para evitar conflito com View do Themed
                  <NativeView key={`${card.cardId}_${index}`} style={styles.card as any}>
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
                  </NativeView>
                );
              })}

              {noteDraft.trim() || leituraSelecionada.note ? (
                <NativeView style={styles.noteBlock as any}>
                  <Text style={styles.noteTitle}>{t('tiragem.personalNotes')}</Text>
                  <Text style={styles.baseText}>{noteDraft.trim() || leituraSelecionada.note}</Text>
                </NativeView>
              ) : null}
            </NativeView>

            {/* Bloco de anotação editável — fora do NativeView capturável */}
            <View style={styles.noteBlock}>
              <Text style={styles.noteTitle}>{t('tiragem.personalNotes')}</Text>
              <TextInput
                value={noteDraft}
                onChangeText={setNoteDraft}
                placeholder={t('tiragem.addNote')}
                placeholderTextColor="#888"
                style={styles.noteInput}
                multiline
              />
              <TouchableOpacity style={GStyles.mainButton} onPress={salvarAnotacao}>
                <Text style={GStyles.buttonText}>SALVAR ANOTAÇÃO</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[GStyles.mainButton, { marginTop: 12 }]}
              onPress={() => void compartilharImagem(personalReadingRef, t('tiragem.shareReading'))}
            >
              <Text style={GStyles.buttonText}>{t('tiragem.shareReading')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.block}>
            <Text style={styles.baseText}>{t('tiragem.noReadings')}</Text>
          </View>
        )}

        {readings.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>{t('tiragem.history')}</Text>

            <TouchableOpacity style={styles.dropdownButton} onPress={() => setHistoryOpen((prev) => !prev)}>
              <Text style={styles.dropdownTitle}>{historyOpen ? '▴ ' + t('common.close') : '▾ ' + t('common.back')}</Text>
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
                        {t('tiragem.favorites')}
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
                                    {active ? ` • ${t('tiragem.selected')}` : ''}
                                  </Text>
                                  <Text style={styles.dropdownItemText}>{cardsSummary}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.favoriteButton}
                                  onPress={() => { void alternarFavorito(item.id); }}
                                  accessibilityRole="button"
                                  accessibilityLabel={item.favorite ? t('tiragem.removeFavorite') : t('tiragem.markFavorite')}
                                >
                                  <Text style={[styles.favoriteButtonText, item.favorite ? styles.favoriteButtonTextActive : null]}>
                                    {item.favorite ? '★' : '☆'}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              {item.favorite ? <Text style={styles.favoriteTag}>{t('tiragem.favorite')}</Text> : null}
                            </View>
                          );
                        })}
                      </View>
                    ) : null}
                  </>
                ) : null}

                <Text style={styles.demaisTiragensSectionTitle}>{t('tiragem.noReadings')}</Text>

                {readings.filter((item) => !item.favorite).map((item) => {
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
                            {active ? ` • ${t('tiragem.selected')}` : ''}
                          </Text>
                          <Text style={styles.dropdownItemText}>{cardsSummary}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.favoriteButton}
                          onPress={() => { void alternarFavorito(item.id); }}
                          accessibilityRole="button"
                          accessibilityLabel={item.favorite ? t('tiragem.removeFavorite') : t('tiragem.markFavorite')}
                        >
                          <Text style={[styles.favoriteButtonText, item.favorite ? styles.favoriteButtonTextActive : null]}>
                            {item.favorite ? '★' : '☆'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {item.favorite ? <Text style={styles.favoriteTag}>{t('tiragem.favorite')}</Text> : null}
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.block}>
            <Text style={styles.baseText}>{t('tiragem.noFavoriteReadings')}</Text>
          </View>
        )}
      </ScrollView>
    );
  }

  // MODO TERCEIROS
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>✦ LEITURA PARA TERCEIROS</Text>
      <Text style={GStyles.title}>Consulta para Outra Pessoa</Text>

      <TouchableOpacity
        style={[GStyles.mainButton, { marginBottom: 20 }]}
        onPress={() => setModo('meu')}
      >
        <Text style={GStyles.buttonText}>{t('tiragem.drawForMeShort')}</Text>
      </TouchableOpacity>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>{t('tiragem.drawForOthers')}</Text>

        <Text style={styles.selectorLabel}>{t('tiragem.personName')}</Text>
        <TextInput
          value={nomeOutraPessoa}
          onChangeText={setNomeOutraPessoa}
          placeholder={t('tiragem.enterPersonName')}
          placeholderTextColor="#888"
          style={styles.input}
        />

        <Text style={styles.selectorLabel}>{t('tiragem.personSign')}</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setSignoMenuOpen((current) => !current);
            setDeckMenuOpenTerceiros(false);
            setCountMenuOpenTerceiros(false);
          }}
        >
          <Text style={styles.dropdownTitle}>{signoMenuOpen ? '▴ ' : '▾ '}{translateSign(signoOutraPessoa)}</Text>
        </TouchableOpacity>

        {signoMenuOpen ? (
          <View style={styles.dropdownList}>
            {SIGNOS.map((signo) => (
              <TouchableOpacity
                key={signo}
                style={[styles.dropdownItem, signoOutraPessoa === signo ? styles.dropdownItemActive : null]}
                onPress={() => {
                  setSignoOutraPessoa(signo);
                  setSignoMenuOpen(false);
                }}
              >
                <Text style={styles.dropdownItemTitle}>
                  {signoOutraPessoa === signo ? '▾ ' : '▸ '}
                  {translateSign(signo)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Configurações da Leitura</Text>

        <Text style={styles.selectorLabel}>Baralho</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setDeckMenuOpenTerceiros((current) => !current);
            setCountMenuOpenTerceiros(false);
            setSignoMenuOpen(false);
          }}
        >
          <Text style={styles.dropdownTitle}>{deckMenuOpenTerceiros ? '▴ ' : '▾ '}{selectedDeckTitleTerceiros}</Text>
        </TouchableOpacity>

        {deckMenuOpenTerceiros ? (
          <View style={styles.dropdownList}>
            {deckOptions.map((deckId) => (
              <TouchableOpacity
                key={deckId}
                style={[styles.dropdownItem, selectedDeckIdTerceiros === deckId ? styles.dropdownItemActive : null]}
                onPress={() => {
                  setSelectedDeckIdTerceiros(deckId);
                  setDeckMenuOpenTerceiros(false);
                }}
              >
                <Text style={styles.dropdownItemTitle}>
                  {selectedDeckIdTerceiros === deckId ? '▾ ' : '▸ '}
                  {getDeckTitle(deckId)}
                </Text>
                <Text style={styles.dropdownItemText}>{getDeckSubtitle(deckId)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={styles.selectorLabel}>Quantidade de cartas</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setCountMenuOpenTerceiros((current) => !current);
            setDeckMenuOpenTerceiros(false);
            setSignoMenuOpen(false);
          }}
        >
          <Text style={styles.dropdownTitle}>{countMenuOpenTerceiros ? '▴ ' : '▾ '}{formatCardLabel(selectedCardCountTerceiros)}</Text>
        </TouchableOpacity>

        {countMenuOpenTerceiros ? (
          <View style={styles.dropdownList}>
            {countOptions.map((count) => (
              <TouchableOpacity
                key={count}
                style={[styles.dropdownItem, selectedCardCountTerceiros === count ? styles.dropdownItemActive : null]}
                onPress={() => {
                  setSelectedCardCountTerceiros(count);
                  setCountMenuOpenTerceiros(false);
                }}
              >
                <Text style={styles.dropdownItemTitle}>
                  {selectedCardCountTerceiros === count ? '▾ ' : '▸ '}
                  {formatCardLabel(count)}
                </Text>
                <Text style={styles.dropdownItemText}>{count === 3 ? 'Passado, presente e futuro.' : 'Tiragem personalizada.'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={styles.selectorLabel}>{t('tiragem.question')}</Text>
        <TextInput
          value={questionTerceiros}
          onChangeText={setQuestionTerceiros}
          placeholder={t('tiragem.question')}
          placeholderTextColor="#888"
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={GStyles.mainButton} onPress={fazerTiragemTerceiros} disabled={isDrawingTerceiros}>
          <Text style={GStyles.buttonText}>{isDrawingTerceiros ? 'CONSULTANDO...' : `TIRAR ${formatCardLabel(selectedCardCountTerceiros).toUpperCase()}`}</Text>
        </TouchableOpacity>
      </View>

      {leituraSelecionadaTerceiros ? (
        <View style={styles.block}>
          {/*
            FIX: mesma correção do modo "meu" — NativeView puro com backgroundColor
            explícito como raiz da área capturável pelo captureRef.
          */}
          <NativeView
            ref={thirdPartyReadingRef}
            collapsable={false}
            style={{ backgroundColor: (styles.block as any)?.backgroundColor ?? '#1a1025' }}
          >
            <Text style={styles.blockTitle}>{t('tiragem.drawForOthers')} - {leituraSelecionadaTerceiros.pessoaNome}</Text>
            <Text style={styles.baseText}>
              {leituraSelecionadaTerceiros.pessoaNome} • {translateSign(leituraSelecionadaTerceiros.pessoaSigno)}
            </Text>
            <Text style={styles.questionText}>{t('tiragem.question_label')}: {leituraSelecionadaTerceiros.question}</Text>

            {leituraSelecionadaTerceiros.cards.map((card, index) => {
              const base = allCards.find((item) => item.id === card.cardId);
              if (!base) return null;

              const posicao = getPositionLabel(index, leituraSelecionadaTerceiros.cardCount ?? selectedCardCountTerceiros);

              return (
                <NativeView key={`${card.cardId}_${index}`} style={styles.card as any}>
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
                </NativeView>
              );
            })}
          </NativeView>

          <TouchableOpacity
            style={[GStyles.mainButton, { marginTop: 12 }]}
            onPress={() => void compartilharImagem(thirdPartyReadingRef, t('tiragem.shareReading'))}
          >
            <Text style={GStyles.buttonText}>{t('tiragem.shareReading')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.baseText}>{t('tiragem.noReadings')}</Text>
        </View>
      )}

      {terceiros.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t('tiragem.history')}</Text>

          <TouchableOpacity style={styles.dropdownButton} onPress={() => setHistoryOpenTerceiros((prev) => !prev)}>
            <Text style={styles.dropdownTitle}>{historyOpenTerceiros ? '▴ Fechar leituras' : '▾ Abrir leituras'}</Text>
          </TouchableOpacity>

          {historyOpenTerceiros ? (
            <View style={styles.dropdownList}>
              {terceiros.map((item) => {
                const cardsSummary = item.cards.map((card) => card.nome).join(' • ');
                const active = item.id === leituraSelecionadaTerceiros?.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.dropdownItem, active ? styles.dropdownItemActive : null]}
                    onPress={() => {
                      setSelectedReadingIdTerceiros((current) => (current === item.id ? null : item.id));
                    }}
                  >
                    <Text style={styles.dropdownItemTitle}>
                      {active ? '▾ ' : '▸ '}
                      {item.pessoaNome}
                      {' • '}
                      {item.pessoaSigno}
                      {' • '}
                      {getDeckTitle(item.deckId)}
                      {' • '}
                      {item.cardCount ?? item.cards.length} cartas
                      {active ? ` • ${t('tiragem.selected')}` : ''}
                    </Text>
                    <Text style={styles.dropdownItemText}>{cardsSummary}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.baseText}>{t('tiragem.noThirdPartyReadings')}</Text>
        </View>
      )}
    </ScrollView>
  );
}