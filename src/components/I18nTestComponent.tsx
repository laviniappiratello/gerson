import { Text } from '@/components/Themed';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../src/i18n/useTranslation';

export function I18nTestComponent() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const isPortuguese = currentLanguage?.startsWith('pt');

  const handleToggleLanguage = async () => {
    await changeLanguage(isPortuguese ? 'en' : 'pt-BR');
  };

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
        backgroundColor: 'rgba(15, 9, 24, 0.94)',
        borderWidth: 1.5,
        borderColor: '#e4c326',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
      }}
    >
      <Text
        style={{
          color: isPortuguese ? '#e4c326' : 'rgba(228, 195, 38, 0.55)',
          fontSize: 11,
          fontWeight: '800',
        }}
      >
        PT
      </Text>

      <View
        style={[
          {
            width: 30,
            height: 18,
            borderRadius: 999,
            backgroundColor: 'rgba(228, 195, 38, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(228, 195, 38, 0.6)',
            justifyContent: 'center',
            paddingHorizontal: 2,
          },
        ]}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: '#e4c326',
            transform: [{ translateX: isPortuguese ? 0 : 12 }],
          }}
        />
      </View>

      <Text
        style={{
          color: !isPortuguese ? '#e4c326' : 'rgba(228, 195, 38, 0.55)',
          fontSize: 11,
          fontWeight: '800',
        }}
      >
        EN
      </Text>
    </TouchableOpacity>
  );
}
