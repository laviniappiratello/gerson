import { useRouter } from 'expo-router';
import { RegisterScreenContent } from '../../src/features/auth/Register';

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <RegisterScreenContent
      onGoToLogin={() => router.replace('/(auth)/login')}
      onGoToOnboarding={() => router.replace('/onboarding')}
    />
  );
}