import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage, useTranslation } from '../../src/i18n/useTranslation';
import { makeGlobalStyles, getColors } from '../../src/styles/GlobalStyles';

const languageOptions = [
  { code: 'pt-BR', name: 'PT' },
  { code: 'en', name: 'EN' },
];

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isLight } = useTheme();
  const C = getColors(isLight);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {languageOptions.map((lang, index) => {
        const isActive = currentLanguage === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            onPress={() => changeLanguage(lang.code)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: isActive ? C.gold : 'transparent',
              borderWidth: 1,
              borderColor: isActive ? C.gold : C.panelBorder,
            }}
          >
            <Text style={{
              color: isActive ? (isLight ? '#fff' : '#0f0918') : C.text,
              fontWeight: '700',
              fontSize: 12,
            }}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}