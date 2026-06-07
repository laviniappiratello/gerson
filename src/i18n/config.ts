import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native'; // Importante para verificar a plataforma
import en from '../locales/en.json';
import pt_BR from '../locales/pt-BR.json';

// Importação dinâmica para evitar erro na web
const getAsyncStorage = () => {
  if (Platform.OS !== 'web') {
    return require('@react-native-async-storage/async-storage').default;
  }
  return null;
};

const LANGUAGE_STORAGE_KEY = '@persephone/language';

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async (callback: (lang: string) => void) => {
    try {
      let savedLanguage = null;

      if (Platform.OS === 'web') {
        savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      } else {
        const AsyncStorage = getAsyncStorage();
        savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      }

      callback(savedLanguage || 'pt-BR');
    } catch (e) {
      callback('pt-BR');
    }
  },
  cacheUserLanguage: async (language: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } else {
        const AsyncStorage = getAsyncStorage();
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }
    } catch (e) {
      // Silencioso
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-BR',
    resources: {
      'pt-BR': { translation: pt_BR },
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;