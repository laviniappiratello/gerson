import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useLanguage } from '../../src/i18n/useTranslation';
import { useTheme } from '../../src/context/ThemeContext';
import { getColors } from '../../src/styles/GlobalStyles';
import { useSegments } from 'expo-router';

export function I18nTestComponent() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isLight } = useTheme();
  const C = getColors(isLight);
  const segments = useSegments();

  const isPortuguese = currentLanguage?.startsWith('pt');

  // Esconde nas telas de auth (login, register) e onboarding
  const firstSegment = segments[0];
  if (firstSegment === '(auth)' || firstSegment === 'onboarding') return null;

  const handleToggleLanguage = async () => {
    await changeLanguage(isPortuguese ? 'en' : 'pt-BR');
  };

  const trackBg  = isLight ? 'rgba(194,24,91,0.2)'  : 'rgba(228,195,38,0.2)';
  const trackBorder = isLight ? 'rgba(194,24,91,0.6)' : 'rgba(228,195,38,0.6)';
  const thumbBg  = isLight ? '#c2185b' : '#e4c326';
  const containerBg = isLight ? 'rgba(255,240,245,0.96)' : 'rgba(15,9,24,0.94)';
  const containerBorder = isLight ? '#c2185b' : '#e4c326';
  const activeColor   = isLight ? '#c2185b' : '#e4c326';
  const inactiveColor = isLight ? 'rgba(194,24,91,0.45)' : 'rgba(228,195,38,0.55)';

  return (
    <TouchableOpacity
      onPress={handleToggleLanguage}
      activeOpacity={0.85}
      style={{
        position: 'absolute',
        bottom: '10%',
        right: 20,
        width: 94,
        height: 40,
        borderRadius: 22,
        backgroundColor: containerBg,
        borderWidth: 1.5,
        borderColor: containerBorder,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
      }}
    >
      <Text style={{ color: isPortuguese ? activeColor : inactiveColor, fontSize: 11, fontWeight: '800' }}>PT</Text>

      <View style={{ width: 30, height: 18, borderRadius: 999, backgroundColor: trackBg, borderWidth: 1, borderColor: trackBorder, justifyContent: 'center', paddingHorizontal: 2 }}>
        <View style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: thumbBg, transform: [{ translateX: isPortuguese ? 0 : 12 }] }} />
      </View>

      <Text style={{ color: !isPortuguese ? activeColor : inactiveColor, fontSize: 11, fontWeight: '800' }}>EN</Text>
    </TouchableOpacity>
  );
}