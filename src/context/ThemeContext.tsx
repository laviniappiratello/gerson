import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { LightSensor } from 'expo-sensors';
import { Platform } from 'react-native';

type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  isLight: false,
});

// Lux abaixo desse valor → muda para dark automaticamente
const DARK_THRESHOLD = 50;
// Histerese: só muda de volta para light acima desse valor
const LIGHT_THRESHOLD = 120;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  // Guarda se o usuário tocou manualmente no switch
  const manualOverride = useRef(false);
  const manualTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTheme = useCallback(() => {
    // Ao trocar manualmente, suspende o sensor por 30s
    manualOverride.current = true;
    if (manualTimer.current) clearTimeout(manualTimer.current);
    manualTimer.current = setTimeout(() => {
      manualOverride.current = false;
    }, 30_000);

    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    // Sensor só funciona em nativo
    if (Platform.OS === 'web') return;

    let subscription: ReturnType<typeof LightSensor.addListener> | null = null;

    LightSensor.isAvailableAsync().then((available) => {
      if (!available) return;

      LightSensor.setUpdateInterval(2000);

      subscription = LightSensor.addListener(({ illuminance }) => {
        if (manualOverride.current) return;

        setTheme((prev) => {
          if (prev === 'light' && illuminance < DARK_THRESHOLD) return 'dark';
          if (prev === 'dark' && illuminance > LIGHT_THRESHOLD) return 'light';
          return prev;
        });
      });
    });

    return () => {
      subscription?.remove();
      if (manualTimer.current) clearTimeout(manualTimer.current);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}