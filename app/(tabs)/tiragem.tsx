import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { TAROT_CARDS } from '../../constants/OraculoData';
import { useAuth } from '../../src/context/AuthContext';
import {
    addReading,
    getReadings,
    makeId,
    type CardDraw,
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

  const sortearTresCartas = (): CardDraw[] => {
    const pool = [...TAROT_CARDS];
    const selected: CardDraw[] = [];

    for (let i = 0; i < 3; i += 1) {
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

    const cards = sortearTresCartas();
    const reading: ReadingRecord = {
      id: makeId('reading'),
      userId: user.id,
      question: question.trim(),
      cards,
      createdAt: Date.now(),
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
      <Text style={GStyles.title}>Tiragem de 3 Cartas</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Pergunta para o Tarot</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Escreva sua pergunta"
          placeholderTextColor="#888"
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={GStyles.mainButton} onPress={fazerTiragem} disabled={isDrawing}>
          <Text style={GStyles.buttonText}>{isDrawing ? 'CONSULTANDO...' : 'TIRAR 3 CARTAS'}</Text>
        </TouchableOpacity>
      </View>

      {readings.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Historico de Tiragens</Text>

          <TouchableOpacity style={styles.dropdownButton} onPress={() => setHistoryOpen((prev) => !prev)}>
            <Text style={styles.dropdownTitle}>{historyOpen ? '▴ Fechar tiragens' : '▾ Abrir tiragens'}</Text>
          </TouchableOpacity>

          {historyOpen ? (
            <View style={styles.dropdownList}>
              {readings.map((item, index) => {
                const label = `Tiragem ${readings.length - index}`;
                const cardsSummary = item.cards.map((card) => card.nome).join(' • ');
                const active = item.id === leituraSelecionada?.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.dropdownItem, active ? styles.dropdownItemActive : null]}
                    onPress={() => {
                      setSelectedReadingId((current) => (current === item.id ? null : item.id));
                    }}
                  >
                    <Text style={styles.dropdownItemTitle}>
                      {active ? '▾ ' : '▸ '}
                      {label}
                      {active ? ' • Selecionada' : ''}
                    </Text>
                    <Text style={styles.dropdownItemText}>{cardsSummary}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {leituraSelecionada ? (
            <>
              <Text style={styles.questionText}>Pergunta: {leituraSelecionada.question}</Text>

              {leituraSelecionada.cards.map((card, index) => {
                const base = TAROT_CARDS.find((item) => item.id === card.cardId);
                if (!base) return null;

                const posicao = ['Passado', 'Presente', 'Futuro'][index] ?? `Carta ${index + 1}`;

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
            </>
          ) : (
            <Text style={styles.baseText}>Selecione uma tiragem para ver os detalhes.</Text>
          )}
        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.baseText}>Ainda não há tiragens para este perfil.</Text>
        </View>
      )}
    </ScrollView>
  );
}