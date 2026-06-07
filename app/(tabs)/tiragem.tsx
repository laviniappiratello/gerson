import { Text } from '@/components/Themed';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Alert, Image, View, View as NativeView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';import { captureRef } from 'react-native-view-shot';
import { INFO_DECKS } from '../../constants/MisticoData';
import { CIGANO_CARDS, MARSELHA_CARDS, TAROT_CARDS_COMPLETO, type SignoNome } from '../../constants/OraculoData';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useTranslation } from '../../src/i18n/useTranslation';
import { addReading, addThirdPartyReading, getReadings, getThirdPartyReadings, makeId, setReadingNote, toggleReadingFavorite, type CardDraw, type DeckId, type ReadingRecord, type ThirdPartyReadingRecord } from '../../src/services/storage';
import { makeGlobalStyles, getColors } from '../../src/styles/GlobalStyles';
import { makeTiragemStyles } from '../../src/styles/screens/TiragemScreenStyles';
import { exportarHistoricoPDF } from '../../src/services/pdfService';
import * as AuthSession from 'expo-auth-session';
import { uploadParaDrive } from '../../src/services/driveService';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SIGNOS: SignoNome[] = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes'];

export default function TiragemScreen() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const { isLight } = useTheme();
  const styles = makeTiragemStyles(isLight);
  const GStyles = makeGlobalStyles(isLight);
  const C = getColors(isLight);
  const handleExport = async () => {
  const dados = modo === 'meu' ? readings : terceiros;await exportarHistoricoPDF(dados, t);};  const personalReadingRef = useRef<any>(null);
  const thirdPartyReadingRef = useRef<any>(null);
  const [modo, setModo] = useState<'meu' | 'terceiros'>('meu');
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
  const [enviando, setEnviando] = useState(false);
  
const [backupFeito, setBackupFeito] = useState(false);
useEffect(() => {
  const carregarStatus = async () => {
    if (user?.id) {
      const status = await AsyncStorage.getItem(`backup_realizado_${user.id}`);
      setBackupFeito(status === 'true');
    }
  };
  carregarStatus();
}, [user?.id]);const deckOptions: DeckId[] = ['rider-waite', 'cigano', 'marselha'];
  const countOptions = [1, 2, 3, 4, 5];
  const deckCards: Record<DeckId, typeof TAROT_CARDS_COMPLETO> = { 'rider-waite': TAROT_CARDS_COMPLETO, cigano: CIGANO_CARDS, marselha: MARSELHA_CARDS };
  const allCards = [...TAROT_CARDS_COMPLETO, ...CIGANO_CARDS, ...MARSELHA_CARDS];
  const leituraSelecionada = readings.find((i) => i.id === selectedReadingId) ?? null;
  const leituraSelecionadaTerceiros = terceiros.find((i) => i.id === selectedReadingIdTerceiros) ?? null;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: '360291271962-hvj3vbj49k8d0oa18ehrcucasr5r6lbj.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/drive.file'],
    redirectUri: 'http://localhost:8081',
    extraParams: { prompt: 'consent select_account' }
  }, {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token'
  });
useEffect(() => {
  const checkStatus = () => {
    const status = localStorage.getItem('backup_realizado');
    if (status === 'true') {
      setBackupFeito(true);
      setEnviando(false);
    }
  };

  // Checa a cada 1 segundo se o backup foi feito na outra guia/popup
  const interval = setInterval(checkStatus, 1000);
  return () => clearInterval(interval);
}, []);
useEffect(() => {
  if (response?.type === 'success') {
    const { access_token } = response.params;
    setAccessToken(access_token);
    
    // Inicia o processo de envio
    setEnviando(true);
    
    // Simula o tempo de upload ou chama sua função real
    setTimeout(() => {
      setEnviando(false);
      setBackupFeito(true);
      localStorage.setItem('backup_realizado', 'true'); // Persiste que o backup foi feito
      Alert.alert("Sucesso", "Backup concluído com sucesso!");
    }, 2000); 
  }
}, [response]);
const executarBackup = async (token: string) => {
  if (!user?.id) return;
  
  setEnviando(true);
  const sucesso = await uploadParaDrive(token, readings);
  
  if (sucesso) {
    setBackupFeito(true);
    // Troque localStorage por AsyncStorage
    await AsyncStorage.setItem(`backup_realizado_${user.id}`, 'true');
    Alert.alert("Sucesso", "Backup enviado com sucesso!");
  } else {
    Alert.alert("Erro", "Falha ao enviar.");
  }
  setEnviando(false);
};
useEffect(() => {
  if (!user?.id) return;

  const checkStatus = () => {
    const status = localStorage.getItem(`backup_realizado_${user.id}`);
    if (status === 'true') {
      setBackupFeito(true);
      setEnviando(false);
    }
  };

  const interval = setInterval(checkStatus, 1000);
  return () => clearInterval(interval);
}, [user?.id]);
  useEffect(() => {
    if (!user) { setReadings([]); return; }
    void (async () => { setReadings(await getReadings(user.id)); })();
  }, [user?.id]);
  useEffect(() => { void carregarTerceiros(); }, []);
  useEffect(() => {
    if (!readings.length) { setSelectedReadingId(null); return; }
    setSelectedReadingId((cur) => cur && readings.some((i) => i.id === cur) ? cur : null);
  }, [readings]);
  useEffect(() => { setNoteDraft(leituraSelecionada?.note ?? ''); }, [leituraSelecionada?.id, leituraSelecionada?.note]);
const iniciarBackup = async () => {
  if (!user?.id) return;
  
  // Limpa o status anterior direto, sem hooks
  await AsyncStorage.removeItem(`backup_realizado_${user.id}`); 
  setEnviando(true);
  
  try {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?...`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, "http://localhost:8081");

    if (result.type === 'success') {
      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.substring(1));
      const token = params.get('access_token');
      
      if (token) {
        setAccessToken(token);
        // Chama a função direto, sem useEffect
        await executarBackup(token);
      }
    }
  } catch (error) {
    Alert.alert("Erro", "Falha na autenticação.");
  } finally {
    setEnviando(false);
  }
};
  const carregarTerceiros = async () => setTerceiros(await getThirdPartyReadings());
const formatCardLabel = (count: number) => {

  return `${count} ${count === 1 ? t('tiragem.card') : t('tiragem.cards')}`;};
  const getDeckTitle = (deckId?: DeckId) => { const id = deckId ?? 'rider-waite'; switch (id) { case 'rider-waite': return t('decks.riderWaite'); case 'cigano': return t('decks.cigano'); case 'marselha': return t('decks.marselha'); default: return INFO_DECKS['rider-waite'].titulo; } };
  const getDeckSubtitle = (deckId?: DeckId) => { const id = deckId ?? 'rider-waite'; switch (id) { case 'rider-waite': return t('decks.riderWaiteDesc'); case 'cigano': return t('decks.ciganoDesc'); case 'marselha': return t('decks.marselhaeDesc'); default: return INFO_DECKS['rider-waite'].subtitulo; } };
  const translateSign = (signName: SignoNome) => { const map: Record<SignoNome, string> = { Áries:'aries',Touro:'taurus',Gêmeos:'gemini',Câncer:'cancer',Leão:'leo',Virgem:'virgo',Libra:'libra',Escorpião:'scorpio',Sagitário:'sagittarius',Capricórnio:'capricorn',Aquário:'aquarius',Peixes:'pisces' }; return t(`signs.${map[signName]}`); };
  const getPositionLabel = (index: number, cardCount?: number) => { const count = cardCount ?? 3; if (count === 3) { const positions = [t('tiragem.past'), t('tiragem.present'), t('tiragem.future')]; return positions[index] ?? `${t('tiragem.card')} ${index + 1}`; } return `${t('tiragem.card')} ${index + 1}`; };
  const selectedDeckTitle = getDeckTitle(selectedDeckId);
  const selectedDeckTitleTerceiros = getDeckTitle(selectedDeckIdTerceiros);
  const captureBg = isLight ? '#fff0f5' : '#1a1025';

  const downloadWebImage = async (dataUrl: string, filename: string) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl; link.download = filename; link.style.display = 'none';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  const compartilharImagem = async (targetRef: RefObject<any>, titulo: string) => {
    try {
      if (!targetRef.current) { Alert.alert(t('common.error'), t('tiragem.shareError')); return; }
      if (Platform.OS === 'web') {
        const base64 = await captureRef(targetRef, { format: 'png', quality: 1, result: 'base64' });
        const safeTitle = titulo.replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
        await downloadWebImage(`data:image/png;base64,${base64}`, `${safeTitle || 'reading'}.png`);
        return;
      }
      if (!(await Sharing.isAvailableAsync())) { Alert.alert(t('common.warning'), t('tiragem.shareUnavailable')); return; }
      const uri = await captureRef(targetRef, { format: 'png', quality: 1, result: 'tmpfile' });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: titulo, UTI: 'public.png' });
    } catch (err) { console.error('[compartilharImagem] erro:', err); Alert.alert(t('common.error'), t('tiragem.shareError')); }
  };

  const alternarFavorito = async (readingId: string) => {
    if (!user) return;
    const changed = await toggleReadingFavorite(user.id, readingId);
    if (!changed) return;
    setReadings(await getReadings(user.id));
  };
  const salvarAnotacao = async () => {
    if (!user || !leituraSelecionada) return;
    const changed = await setReadingNote(user.id, leituraSelecionada.id, noteDraft);
    if (!changed) return;
    setReadings(await getReadings(user.id));
  };
  const sortearCartas = (deckId: DeckId, amount: number): CardDraw[] => {
    const pool = [...deckCards[deckId]]; const selected: CardDraw[] = [];
    for (let i = 0; i < amount; i++) { const idx = Math.floor(Math.random() * pool.length); const card = pool.splice(idx, 1)[0]; selected.push({ cardId: card.id, nome: card.nome, invertida: Math.random() < 0.5 }); }
    return selected;
  };
  const fazerTiragem = async () => {
    if (!user || !question.trim()) return;
    setIsDrawing(true);
    const cards = sortearCartas(selectedDeckId, selectedCardCount);
    const reading: ReadingRecord = { id: makeId('reading'), userId: user.id, question: question.trim(), cards, deckId: selectedDeckId, cardCount: selectedCardCount, createdAt: Date.now(), favorite: false };
    await addReading(reading);
    setReadings(await getReadings(user.id));
    setQuestion(''); setSelectedReadingId(reading.id); setHistoryOpen(true); setIsDrawing(false);
  };
  const fazerTiragemTerceiros = async () => {
    if (!nomeOutraPessoa.trim()) { alert(t('tiragem.enterPersonName')); return; }
    if (!questionTerceiros.trim()) { alert(t('tiragem.question')); return; }
    setIsDrawingTerceiros(true);
    const cards = sortearCartas(selectedDeckIdTerceiros, selectedCardCountTerceiros);
    const reading: ThirdPartyReadingRecord = { id: makeId('reading'), pessoaNome: nomeOutraPessoa.trim(), pessoaSigno: signoOutraPessoa, question: questionTerceiros.trim(), cards, deckId: selectedDeckIdTerceiros, cardCount: selectedCardCountTerceiros, createdAt: Date.now() };
    await addThirdPartyReading(reading); await carregarTerceiros();
    setQuestionTerceiros(''); setSelectedReadingIdTerceiros(reading.id); setHistoryOpenTerceiros(true); setIsDrawingTerceiros(false);
  };

  if (isLoading || !user) {
    return <View style={GStyles.container}><Text style={GStyles.title}>Carregando tiragem...</Text></View>;
  }

  const placeholderColor = isLight ? 'rgba(194,24,91,0.5)' : '#888';

if (modo === 'meu') {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>✦ ORÁCULO</Text>
      <Text style={GStyles.title}>{t('tiragem.customDrawTitle')}</Text>
      <TouchableOpacity style={[GStyles.mainButton, { marginBottom: 20 }]} onPress={() => { setModo('terceiros'); setNomeOutraPessoa(''); setSignoOutraPessoa('Áries'); setQuestionTerceiros(''); }}>
        <Text style={GStyles.buttonText}>{t('tiragem.drawForMe')}</Text>
      </TouchableOpacity>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>{t('tiragem.title')}</Text>
        <Text style={styles.selectorLabel}>{t('tiragem.selectDeck')}</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => { setDeckMenuOpen((c) => !c); setCountMenuOpen(false); }}>
          <Text style={styles.dropdownTitle}>{deckMenuOpen ? '▴ ' : '▾ '}{selectedDeckTitle}</Text>
        </TouchableOpacity>
        {deckMenuOpen && <View style={styles.dropdownList}>{deckOptions.map((deckId) => <TouchableOpacity key={deckId} style={[styles.dropdownItem, selectedDeckId === deckId && styles.dropdownItemActive]} onPress={() => { setSelectedDeckId(deckId); setDeckMenuOpen(false); }}><Text style={styles.dropdownItemTitle}>{selectedDeckId === deckId ? '▾ ' : '▸ '}{getDeckTitle(deckId)}</Text><Text style={styles.dropdownItemText}>{getDeckSubtitle(deckId)}</Text></TouchableOpacity>)}</View>}

        <Text style={styles.selectorLabel}>{t('tiragem.selectCardCount')}</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => { setCountMenuOpen((c) => !c); setDeckMenuOpen(false); }}>
          <Text style={styles.dropdownTitle}>{countMenuOpen ? '▴ ' : '▾ '}{formatCardLabel(selectedCardCount)}</Text>
        </TouchableOpacity>
        {countMenuOpen && <View style={styles.dropdownList}>{countOptions.map((count) => <TouchableOpacity key={count} style={[styles.dropdownItem, selectedCardCount === count && styles.dropdownItemActive]} onPress={() => { setSelectedCardCount(count); setCountMenuOpen(false); }}><Text style={styles.dropdownItemTitle}>{selectedCardCount === count ? '▾ ' : '▸ '}{formatCardLabel(count)}</Text><Text style={styles.dropdownItemText}>{count === 3 ? t('tiragem.pastPresentFuture') : t('tiragem.customDraw')}</Text></TouchableOpacity>)}</View>}

        <TextInput value={question} onChangeText={setQuestion} placeholder={t('tiragem.question')} placeholderTextColor={placeholderColor} style={styles.input} multiline />
        <TouchableOpacity style={GStyles.mainButton} onPress={fazerTiragem} disabled={isDrawing}>
          <Text style={GStyles.buttonText}>{isDrawing ? t('tiragem.drawing') : t('tiragem.draw', { count: formatCardLabel(selectedCardCount).toUpperCase() })}</Text>
        </TouchableOpacity>
      </View>

      {leituraSelecionada ? (
        <View style={styles.block}>
          <NativeView ref={personalReadingRef} collapsable={false} style={{ backgroundColor: captureBg }}>
            <Text style={styles.blockTitle}>{t('tiragem.title')}</Text>
            <Text style={styles.questionText}>{t('tiragem.question_label')}: {leituraSelecionada.question}</Text>
            {leituraSelecionada.cards.map((card, index) => {
              const base = allCards.find((i) => i.id === card.cardId);
              if (!base) return null;
              return (
                <NativeView key={`${card.cardId}_${index}`} style={styles.card as any}>
                  <Text style={styles.cardTitle}>{getPositionLabel(index, leituraSelecionada.cardCount ?? selectedCardCount)}: {base.nome} {card.invertida ? '(Invertida)' : '(Normal)'}</Text>
                  <Image source={base.imagem} style={[styles.readingCardImage, card.invertida && { transform: [{ rotate: '180deg' }] }]} resizeMode="contain" />
                  <Text style={styles.baseText}>{card.invertida ? base.interpretacaoInvertida : base.interpretacaoNormal}</Text>
                </NativeView>
              );
            })}
            {(noteDraft.trim() || leituraSelecionada.note) ? (
              <NativeView style={styles.noteBlock as any}>
                <Text style={styles.noteTitle}>{t('tiragem.personalNotes')}</Text>
                <Text style={styles.baseText}>{noteDraft.trim() || leituraSelecionada.note}</Text>
              </NativeView>
            ) : null}
          </NativeView>
          <View style={styles.noteBlock}>
            <Text style={styles.noteTitle}>{t('tiragem.personalNotes')}</Text>
            <TextInput value={noteDraft} onChangeText={setNoteDraft} placeholder={t('tiragem.addNote')} placeholderTextColor={placeholderColor} style={styles.noteInput} multiline />
            <TouchableOpacity style={GStyles.mainButton} onPress={salvarAnotacao}>
              <Text style={GStyles.buttonText}>{t('tiragem.saveNote')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[GStyles.mainButton, { marginTop: 12 }]} onPress={() => void compartilharImagem(personalReadingRef, t('tiragem.shareReading'))}>
            <Text style={GStyles.buttonText}>{t('tiragem.shareReading')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {readings.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t('tiragem.history')}</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setHistoryOpen((p) => !p)}>
            <Text style={styles.dropdownTitle}>{historyOpen ? '▴ ' + t('common.close') : '▾ ' + t('common.back')}</Text>
          </TouchableOpacity>
          {historyOpen && (
            <View style={styles.dropdownList}>
              {readings.some((i) => i.favorite) && (
                <>
                  <TouchableOpacity style={[styles.dropdownItem, styles.favoritesSectionButton]} onPress={() => setFavoritesOpen((p) => !p)}>
                    <Text style={styles.dropdownItemTitle}>{favoritesOpen ? '▾ ' : '▸ '}{t('tiragem.favorites')}</Text>
                  </TouchableOpacity>
                  {favoritesOpen && (
                    <View style={styles.nestedDropdownList}>
                      {readings.filter((i) => i.favorite).map((item) => {
                        const label = `Tiragem ${readings.length - readings.indexOf(item)}`;
                        const active = item.id === leituraSelecionada?.id;
                        return (
                          <View key={item.id} style={[styles.dropdownItem, active && styles.dropdownItemActive]}>
                            <View style={styles.dropdownItemHeader}>
                              <TouchableOpacity style={styles.dropdownItemMain} onPress={() => setSelectedReadingId((c) => c === item.id ? null : item.id)}>
                                <Text style={styles.dropdownItemTitle}>{active ? '▾ ' : '▸ '}{label} • {getDeckTitle(item.deckId)} • {item.cardCount ?? item.cards.length} cartas{active ? ` • ${t('tiragem.selected')}` : ''}</Text>
                                <Text style={styles.dropdownItemText}>{item.cards.map((c) => c.nome).join(' • ')}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.favoriteButton} onPress={() => void alternarFavorito(item.id)}>
                                <Text style={[styles.favoriteButtonText, item.favorite && styles.favoriteButtonTextActive]}>{item.favorite ? '★' : '☆'}</Text>
                              </TouchableOpacity>
                            </View>
                            {item.favorite && <Text style={styles.favoriteTag}>{t('tiragem.favorite')}</Text>}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </>
              )}
              {readings.filter((i) => !i.favorite).map((item) => {
                const label = `Tiragem ${readings.length - readings.indexOf(item)}`;
                const active = item.id === leituraSelecionada?.id;
                return (
                  <View key={item.id} style={[styles.dropdownItem, active && styles.dropdownItemActive]}>
                    <View style={styles.dropdownItemHeader}>
                      <TouchableOpacity style={styles.dropdownItemMain} onPress={() => setSelectedReadingId((c) => c === item.id ? null : item.id)}>
                        <Text style={styles.dropdownItemTitle}>{active ? '▾ ' : '▸ '}{label} • {getDeckTitle(item.deckId)}{active ? ` • ${t('tiragem.selected')}` : ''}</Text>
                        <Text style={styles.dropdownItemText}>{item.cards.map((c) => c.nome).join(' • ')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.favoriteButton} onPress={() => void alternarFavorito(item.id)}>
                        <Text style={[styles.favoriteButtonText, item.favorite && styles.favoriteButtonTextActive]}>{item.favorite ? '★' : '☆'}</Text>
                      </TouchableOpacity>
                    </View>
                    {item.favorite && <Text style={styles.favoriteTag}>{t('tiragem.favorite')}</Text>}
                  </View>
                );
              })}
            </View>
          )}
<TouchableOpacity 
  disabled={enviando || backupFeito}
  style={{
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: backupFeito ? '#4CAF50' : (isLight ? '#d8749c' : '#6A1B9A'),
    opacity: (enviando || backupFeito) ? 0.7 : 1,
  }} 
  onPress={iniciarBackup}
>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
    {enviando ? "Enviando..." : (backupFeito ? "Backup Concluído!" : "Salvar Backup no Google Drive")}
  </Text>
</TouchableOpacity>
          <TouchableOpacity 
            style={[GStyles.mainButton, {backgroundColor: isLight ? '#eca1bf' : '#6A1B9A', marginTop: 20}]} 
            onPress={handleExport}
          >
            <Text style={GStyles.buttonText}>Baixar Histórico em PDF</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.block}><Text style={styles.baseText}>{t('tiragem.noFavoriteReadings')}</Text></View>
      )}
      
    </ScrollView>
  );
}

  // MODO TERCEIROS
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>✦ LEITURA PARA TERCEIROS</Text>
      <Text style={GStyles.title}>Consulta para Outra Pessoa</Text>
      <TouchableOpacity style={[GStyles.mainButton, { marginBottom: 20 }]} onPress={() => setModo('meu')}>
        <Text style={GStyles.buttonText}>{t('tiragem.drawForMeShort')}</Text>
      </TouchableOpacity>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>{t('tiragem.drawForOthers')}</Text>
        <Text style={styles.selectorLabel}>{t('tiragem.personName')}</Text>
        <TextInput value={nomeOutraPessoa} onChangeText={setNomeOutraPessoa} placeholder={t('tiragem.enterPersonName')} placeholderTextColor={placeholderColor} style={styles.input} />
        <Text style={styles.selectorLabel}>{t('tiragem.personSign')}</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => { setSignoMenuOpen((c) => !c); setDeckMenuOpenTerceiros(false); setCountMenuOpenTerceiros(false); }}>
          <Text style={styles.dropdownTitle}>{signoMenuOpen ? '▴ ' : '▾ '}{translateSign(signoOutraPessoa)}</Text>
        </TouchableOpacity>
        {signoMenuOpen && <View style={styles.dropdownList}>{SIGNOS.map((signo) => <TouchableOpacity key={signo} style={[styles.dropdownItem, signoOutraPessoa === signo && styles.dropdownItemActive]} onPress={() => { setSignoOutraPessoa(signo); setSignoMenuOpen(false); }}><Text style={styles.dropdownItemTitle}>{signoOutraPessoa === signo ? '▾ ' : '▸ '}{translateSign(signo)}</Text></TouchableOpacity>)}</View>}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Configurações da Leitura</Text>
        <Text style={styles.selectorLabel}>Baralho</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => { setDeckMenuOpenTerceiros((c) => !c); setCountMenuOpenTerceiros(false); setSignoMenuOpen(false); }}>
          <Text style={styles.dropdownTitle}>{deckMenuOpenTerceiros ? '▴ ' : '▾ '}{selectedDeckTitleTerceiros}</Text>
        </TouchableOpacity>
        {deckMenuOpenTerceiros && <View style={styles.dropdownList}>{deckOptions.map((deckId) => <TouchableOpacity key={deckId} style={[styles.dropdownItem, selectedDeckIdTerceiros === deckId && styles.dropdownItemActive]} onPress={() => { setSelectedDeckIdTerceiros(deckId); setDeckMenuOpenTerceiros(false); }}><Text style={styles.dropdownItemTitle}>{selectedDeckIdTerceiros === deckId ? '▾ ' : '▸ '}{getDeckTitle(deckId)}</Text><Text style={styles.dropdownItemText}>{getDeckSubtitle(deckId)}</Text></TouchableOpacity>)}</View>}

        <Text style={styles.selectorLabel}>Quantidade de cartas</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => { setCountMenuOpenTerceiros((c) => !c); setDeckMenuOpenTerceiros(false); setSignoMenuOpen(false); }}>
          <Text style={styles.dropdownTitle}>{countMenuOpenTerceiros ? '▴ ' : '▾ '}{formatCardLabel(selectedCardCountTerceiros)}</Text>
        </TouchableOpacity>
        {countMenuOpenTerceiros && <View style={styles.dropdownList}>{countOptions.map((count) => <TouchableOpacity key={count} style={[styles.dropdownItem, selectedCardCountTerceiros === count && styles.dropdownItemActive]} onPress={() => { setSelectedCardCountTerceiros(count); setCountMenuOpenTerceiros(false); }}><Text style={styles.dropdownItemTitle}>{selectedCardCountTerceiros === count ? '▾ ' : '▸ '}{formatCardLabel(count)}</Text><Text style={styles.dropdownItemText}>{count === 3 ? 'Passado, presente e futuro.' : 'Tiragem personalizada.'}</Text></TouchableOpacity>)}</View>}

        <Text style={styles.selectorLabel}>{t('tiragem.question')}</Text>
        <TextInput value={questionTerceiros} onChangeText={setQuestionTerceiros} placeholder={t('tiragem.question')} placeholderTextColor={placeholderColor} style={styles.input} multiline />
        <TouchableOpacity style={GStyles.mainButton} onPress={fazerTiragemTerceiros} disabled={isDrawingTerceiros}>
          <Text style={GStyles.buttonText}>{isDrawingTerceiros ? 'CONSULTANDO...' : `TIRAR ${formatCardLabel(selectedCardCountTerceiros).toUpperCase()}`}</Text>
        </TouchableOpacity>
      </View>

      {leituraSelecionadaTerceiros ? (
        <View style={styles.block}>
          <NativeView ref={thirdPartyReadingRef} collapsable={false} style={{ backgroundColor: captureBg }}>
            <Text style={styles.blockTitle}>{t('tiragem.drawForOthers')} - {leituraSelecionadaTerceiros.pessoaNome}</Text>
            <Text style={styles.baseText}>{leituraSelecionadaTerceiros.pessoaNome} • {translateSign(leituraSelecionadaTerceiros.pessoaSigno)}</Text>
            <Text style={styles.questionText}>{t('tiragem.question_label')}: {leituraSelecionadaTerceiros.question}</Text>
            {leituraSelecionadaTerceiros.cards.map((card, index) => {
              const base = allCards.find((i) => i.id === card.cardId);
              if (!base) return null;
              return (
                <NativeView key={`${card.cardId}_${index}`} style={styles.card as any}>
                  <Text style={styles.cardTitle}>{getPositionLabel(index, leituraSelecionadaTerceiros.cardCount ?? selectedCardCountTerceiros)}: {base.nome} {card.invertida ? '(Invertida)' : '(Normal)'}</Text>
                  <Image source={base.imagem} style={[styles.readingCardImage, card.invertida && { transform: [{ rotate: '180deg' }] }]} resizeMode="contain" />
                  <Text style={styles.baseText}>{card.invertida ? base.interpretacaoInvertida : base.interpretacaoNormal}</Text>
                </NativeView>
              );
            })}
          </NativeView>
          <TouchableOpacity style={[GStyles.mainButton, { marginTop: 12 }]} onPress={() => void compartilharImagem(thirdPartyReadingRef, t('tiragem.shareReading'))}>
            <Text style={GStyles.buttonText}>{t('tiragem.shareReading')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.block}><Text style={styles.baseText}>{t('tiragem.noReadings')}</Text></View>
      )}

      {terceiros.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t('tiragem.history')}</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setHistoryOpenTerceiros((p) => !p)}>
            <Text style={styles.dropdownTitle}>{historyOpenTerceiros ? '▴ Fechar leituras' : '▾ Abrir leituras'}</Text>
          </TouchableOpacity>
          {historyOpenTerceiros && (
            <View style={styles.dropdownList}>
              {terceiros.map((item) => {
                const active = item.id === leituraSelecionadaTerceiros?.id;
                return (
                  <TouchableOpacity key={item.id} style={[styles.dropdownItem, active && styles.dropdownItemActive]} onPress={() => setSelectedReadingIdTerceiros((c) => c === item.id ? null : item.id)}>
                    <Text style={styles.dropdownItemTitle}>{active ? '▾ ' : '▸ '}{item.pessoaNome} • {item.pessoaSigno} • {getDeckTitle(item.deckId)} • {item.cardCount ?? item.cards.length} cartas{active ? ` • ${t('tiragem.selected')}` : ''}</Text>
                    <Text style={styles.dropdownItemText}>{item.cards.map((c) => c.nome).join(' • ')}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.block}><Text style={styles.baseText}>{t('tiragem.noThirdPartyReadings')}</Text></View>
      )}
    </ScrollView>
  );
}