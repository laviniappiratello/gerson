import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../components/Themed';
import { useAuth } from '../src/context/AuthContext';
import { globalStyles as GStyles } from '../src/styles/GlobalStyles';
import { onboardingScreenStyles as styles } from '../src/styles/screens/OnboardingScreenStyles';

const ONBOARDING_STEPS = [
  {
    title: 'Bem-vinda ao Persephone',
    text: 'Seu portal místico funciona offline para signo, arcano e tiragens.',
  },
  {
    title: 'Leitura Personalizada',
    text: 'Cadastre sua data de nascimento para descobrir signo e arcano pessoal.',
  },
  {
    title: 'Tiragem Intuitiva',
    text: 'Faça perguntas e receba leitura de passado, presente e futuro.',
  },
];

export default function OnboardingScreen() {
  const { markOnboardingSeen } = useAuth();
  const [step, setStep] = useState(0);

  const stepData = useMemo(() => ONBOARDING_STEPS[step], [step]);

  const finishOnboarding = async () => {
    await markOnboardingSeen();
    router.replace('/(auth)/register');
  };

  return (
    <View style={[GStyles.container, styles.container]}> 
      <Text style={styles.topBadge}>◍ Iniciação</Text>
      <Text style={[GStyles.title, styles.title]}>{stepData.title}</Text>
      <Text style={GStyles.subtitle}>{stepData.text}</Text>

      <View style={styles.stepsRow}>
        {ONBOARDING_STEPS.map((_, index) => (
          <View
            key={index}
            style={[styles.stepDot, index === step ? styles.stepDotActive : styles.stepDotInactive]}
          />
        ))}
      </View>

      {step < ONBOARDING_STEPS.length - 1 ? (
        <TouchableOpacity style={GStyles.mainButton} onPress={() => setStep((current) => current + 1)}>
          <Text style={GStyles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={GStyles.mainButton} onPress={finishOnboarding}>
          <Text style={GStyles.buttonText}>Entrar no portal</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.skipWrap} onPress={finishOnboarding}>
        <Text style={styles.skipText}>Pular onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}