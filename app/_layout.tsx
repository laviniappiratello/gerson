import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RouteGuard() {
  const { isLoading, user, onboardingSeen } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const firstSegment = segments[0];

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = firstSegment === '(auth)';
    const inTabsGroup = firstSegment === '(tabs)';
    const onOnboarding = firstSegment === 'onboarding';

    if (!onboardingSeen && !onOnboarding) {
      router.replace('/onboarding');
      return;
    }

    if (!user && inTabsGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (user && (inAuthGroup || onOnboarding)) {
      router.replace('/(tabs)/dashboard');
    }
  }, [firstSegment, isLoading, onboardingSeen, router, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0918', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#e4c326" size="large" />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RouteGuard />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
