import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LoginScreenContent } from '../../src/features/auth/Login';
import { syncDatabase } from '../../src/database/sync';

export default function LoginRoute() {
  const router = useRouter();

  useEffect(() => {
    // A sincronização roda apenas uma vez quando a tela de login monta
    syncDatabase()
      .then(() => console.log('Sincronização concluída!'))
      .catch((err) => console.error('Erro no sync:', err));
  }, []);

  return <LoginScreenContent onGoToRegister={() => router.replace('/(auth)/register')} />;
}