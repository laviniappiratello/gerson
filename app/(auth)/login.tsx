import { useRouter } from 'expo-router';
import { LoginScreenContent } from '../../src/features/auth/Login';

export default function LoginRoute() {
  const router = useRouter();

  return <LoginScreenContent onGoToRegister={() => router.replace('/(auth)/register')} />;
}