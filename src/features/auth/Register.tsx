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

  const syncWebDateInput = (date: Date) => {
    const next = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    setWebDateInput(next);
  };

  const handleWebDateChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    if (digits.length <= 2) {
      setWebDateInput(day);
      return;
    }

    if (digits.length <= 4) {
      setWebDateInput(`${day}-${month}`);
      return;
    }

    setWebDateInput(`${day}-${month}-${year}`);
  };

  const validarCampos = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos para continuar.");
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("E-mail inválido", "Por favor, insira um e-mail correto (ex: nome@email.com).");
      return false;
    }
    if (senha.length < 6) {
      Alert.alert("Senha fraca", "Sua senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const gerarRelatorio = () => {
    if (!validarCampos()) return;
    
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
      router.replace('/(tabs)/dashboard'); 
    } catch (e) {
      Alert.alert("Erro", "Erro ao salvar seu destino.");
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDataNascimento(selectedDate);
      if (Platform.OS === 'web') {
        syncWebDateInput(selectedDate);
      }
    }
  };

  const applyWebDateInput = () => {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(webDateInput.trim());
    if (!match) return;

    const parsed = new Date(`${match[3]}-${match[2]}-${match[1]}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return;

    setDataNascimento(parsed);
    syncWebDateInput(parsed);
  };

  if (etapa === 'relatorio' && perfilMistico) {
    return (
      <RelatorioMistico 
        perfil={perfilMistico} 
        onVoltar={() => setEtapa('dados')} 
        onConfirmar={salvarEEntrar} 
      />
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={[GStyles.container, styles.screen]} 
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.authCard}>
        <Text style={styles.topBadgeText}>◍ PERSEPHONE</Text>
        <Text style={[GStyles.title, styles.titleSpacing]}>Cadastro</Text>
        <Text style={GStyles.subtitle}>Crie sua conta para abrir seu portal místico.</Text>

        <TextInput 
          style={RegisterStyles.input} 
          placeholder="Nome Completo" 
          placeholderTextColor="#8f80a8" 
          autoComplete="off"
          value={nome} 
          onChangeText={setNome} 
        />

        <TextInput 
          style={RegisterStyles.input} 
          placeholder="E-mail" 
          placeholderTextColor="#8f80a8" 
          keyboardType="email-address" 
          autoCapitalize="none" 
          autoComplete="off"
          value={email} 
          onChangeText={setEmail} 
        />

        <TextInput 
          style={RegisterStyles.input} 
          placeholder="Senha" 
          placeholderTextColor="#8f80a8" 
          autoComplete="off"
          secureTextEntry 
          value={senha} 
          onChangeText={setSenha} 
        />

        <Text style={[RegisterStyles.label, styles.label]}>
          Data de Nascimento:
        </Text>

        {Platform.OS === 'web' ? (
          <TextInput
            style={[RegisterStyles.secondaryButton, RegisterStyles.webDateInput]}
            value={webDateInput}
            onChangeText={handleWebDateChange}
            onBlur={applyWebDateInput}
            keyboardType="number-pad"
            placeholder="DD-MM-AAAA"
            placeholderTextColor="rgba(211,188,59,0.65)"
          />
        ) : (
          <TouchableOpacity
            style={RegisterStyles.secondaryButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={GStyles.buttonText}>{dataNascimento.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
        )}

        {showDatePicker && Platform.OS !== 'web' && (
          <DateTimePicker 
            value={dataNascimento} 
            mode="date" 
            display="spinner" 
            onChange={onChangeDate} 
            maximumDate={new Date()} 
            textColor={Colors.gold}
          />
        )}

        <TouchableOpacity 
          style={[GStyles.mainButton, styles.ctaButton]} 
          onPress={gerarRelatorio}
          activeOpacity={0.8} 
        >
          <Text style={GStyles.buttonText}>Despertar Destino</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLinkWrap} onPress={onGoToLogin} disabled={!onGoToLogin}>
          <Text style={styles.loginLinkText}>Já tem conta? Fazer login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.onboardingLinkWrap} onPress={onGoToOnboarding} disabled={!onGoToOnboarding}>
          <Text style={styles.onboardingLinkText}>Ver onboarding novamente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}