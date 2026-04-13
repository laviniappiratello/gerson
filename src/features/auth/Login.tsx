import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/Themed';
import { useAuth } from '../../context/AuthContext';
import { canUseBiometrics, requestBiometricAuth } from '../../services/biometrics';
import { getUser } from '../../services/storage';
import { Colors, globalStyles as GStyles } from '../../styles/GlobalStyles';
import { loginScreenStyles as styles } from '../../styles/screens/LoginScreenStyles';

type Props = {
  onGoToRegister?: () => void;
};

export function LoginScreenContent({ onGoToRegister }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), senha);
      if (result === 'wrong_credentials') {
        Alert.alert('Ops!', 'E-mail ou senha incorretos.');
        return;
      }

      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um problema ao entrar. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometria = async () => {
    const disponivel = await canUseBiometrics();
    if (!disponivel) {
      Alert.alert('Biometria', 'Biometria não disponível neste dispositivo.');
      return;
    }

    const currentUser = await getUser();
    if (!currentUser) {
      Alert.alert('Biometria', 'Faça login com e-mail e senha na primeira vez.');
      return;
    }

    setLoading(true);
    try {
      const ok = await requestBiometricAuth('Confirme sua identidade para entrar');
      if (ok) {
        await login(currentUser.email, currentUser.senha);
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Falha', 'Biometria não reconhecida.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[GStyles.container, styles.screen]}
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.authCard}>
        <Text style={styles.topBadgeText}>◍ PERSEPHONE</Text>
        <Text style={[GStyles.title, styles.titleSpacing]}>Entrar</Text>
        <Text style={GStyles.subtitle}>Acesse seu portal místico.</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8f80a8"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="off"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8f80a8"
          secureTextEntry
          autoComplete="off"
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={[GStyles.mainButton, styles.loginButton, loading && styles.loadingButton]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={GStyles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[GStyles.mainButton, styles.btnSecundario]}
          onPress={handleBiometria}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={GStyles.buttonText}>Entrar com biometria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLinkWrap} onPress={onGoToRegister} disabled={!onGoToRegister}>
          <Text style={styles.linkText}>Não tem conta? Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}