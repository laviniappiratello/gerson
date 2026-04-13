import { Text, View } from '@/components/Themed';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { globalStyles as GStyles } from '../../src/styles/GlobalStyles';

export default function TabOneScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        await logout();
        router.replace('/(auth)/login');
      })();
    }, [logout, router]),
  );

  return (
    <View style={GStyles.container}>
      <Text style={GStyles.subtitle}>Encerrando sessão...</Text>
    </View>
  );
}
