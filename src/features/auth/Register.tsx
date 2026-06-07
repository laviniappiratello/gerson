import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/Themed';
import { INFO_ARCANOS, INFO_SIGNOS } from '../../../constants/MisticoData';
import { useAuth } from '../../context/AuthContext';
import { makeId, saveUser } from '../../services/storage';
import { calcularArcanoPessoal } from '../../utils/Arcano';
import { calcularSigno } from '../../utils/Signo';
import { agendarHoroscopo } from '../../services/notificationService'; // Adicionado

import { Colors, globalStyles as GStyles } from '../../styles/GlobalStyles';
import { registerScreenStyles as styles } from '../../styles/screens/RegisterScreenStyles';
import { RelatorioMistico } from '../oraculos/RelatorioMistico';
import { styles as RegisterStyles } from './RegisterStyles';

type RegisterScreenContentProps = {
  onGoToLogin?: () => void;
  onGoToOnboarding?: () => void;
};

export function RegisterScreenContent({ onGoToLogin, onGoToOnboarding }: RegisterScreenContentProps) {
  const { afterRegister } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [webDateInput, setWebDateInput] = useState(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [etapa, setEtapa] = useState<'dados' | 'relatorio'>('dados');
  const [perfilMistico, setPerfilMistico] = useState<any>(null);

  const salvarEEntrar = async () => {
    try {
      const novoUsuario = {
        id: makeId('user'),
        nome,
        email,
        senha,
        birthDate: dataNascimento.toISOString(),
        signo: perfilMistico.nomeSigno,
        arcano: perfilMistico.nomeArcano,
        biometricsEnabled: false,
      };

      await saveUser(novoUsuario);
      await afterRegister(novoUsuario);
      
      // Notificação agendada aqui
      await agendarHoroscopo();
      
      router.replace('/(tabs)/dashboard'); 
    } catch (e) {
      Alert.alert("Erro", "Erro ao salvar seu destino.");
    }
  };

  const gerarRelatorio = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nome.trim() || !email.trim() || !senha.trim()) { Alert.alert("Atenção", "Preencha tudo."); return; }
    if (!emailRegex.test(email)) { Alert.alert("E-mail inválido"); return; }
    if (senha.length < 6) { Alert.alert("Senha fraca"); return; }
    
    const signoNome = calcularSigno(dataNascimento);
    const arcanoNome = calcularArcanoPessoal(dataNascimento);
    setPerfilMistico({
      nomeSigno: signoNome,
      signoInfo: INFO_SIGNOS[signoNome],
      nomeArcano: arcanoNome,
      arcanoInfo: INFO_ARCANOS[arcanoNome],
    });
    setEtapa('relatorio');
  };

  // ... (o restante das funções auxiliares como onChangeDate e applyWebDateInput continuam iguais)

  if (etapa === 'relatorio' && perfilMistico) {
    return <RelatorioMistico perfil={perfilMistico} onVoltar={() => setEtapa('dados')} onConfirmar={salvarEEntrar} />;
  }

  return (
    <ScrollView contentContainerStyle={[GStyles.container, styles.screen]} style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.authCard}>
        <Text style={styles.topBadgeText}>◍ PERSEPHONE</Text>
        <TextInput style={RegisterStyles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={RegisterStyles.input} placeholder="E-mail" value={email} onChangeText={setEmail} />
        <TextInput style={RegisterStyles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
        
        <TouchableOpacity style={RegisterStyles.secondaryButton} onPress={() => setShowDatePicker(true)}>
           <Text style={GStyles.buttonText}>{dataNascimento.toLocaleDateString('pt-BR')}</Text>
        </TouchableOpacity>

        {showDatePicker && Platform.OS !== 'web' && (
          <DateTimePicker value={dataNascimento} mode="date" display="spinner" onChange={(e, d) => d && setDataNascimento(d)} />
        )}

        <TouchableOpacity style={[GStyles.mainButton, styles.ctaButton]} onPress={gerarRelatorio}>
          <Text style={GStyles.buttonText}>Despertar Destino</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}