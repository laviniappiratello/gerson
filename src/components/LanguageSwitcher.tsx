import { Text } from '@/components/Themed';
import { TouchableOpacity, View } from 'react-native';
import { useLanguage, useTranslation } from '../../src/i18n/useTranslation';
import { globalStyles as GStyles } from '../../src/styles/GlobalStyles';

const languageOptions = [
  { code: 'pt-BR', name: 'Português (BR)' },
  { code: 'en', name: 'English' },
];

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <View style={{ gap: 10 }}>
      <Text style={GStyles.title}>{t('settings.language')}</Text>
      {languageOptions.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            GStyles.mainButton,
            currentLanguage === lang.code && { backgroundColor: '#e4c326' },
          ]}
          onPress={() => changeLanguage(lang.code)}
        >
          <Text
            style={[
              GStyles.buttonText,
              currentLanguage === lang.code && { color: '#0f0918' },
            ]}
          >
            {currentLanguage === lang.code ? '✓ ' : ''}
            {lang.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
