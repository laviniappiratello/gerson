import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import pt_BR from '../locales/pt-BR.json';

const LANGUAGE_STORAGE_KEY = '@persephone/language';
const isBrowser = typeof window !== 'undefined';

const readStoredLanguage = async () => {
  if (!isBrowser) {
    return null;
  }

  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  }

  return null;
};

const saveStoredLanguage = async (language: string) => {
  if (!isBrowser) {
    return;
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = isBrowser ? await readStoredLanguage() : await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      const language = savedLanguage || 'pt-BR';
      callback(language);
    } catch (e) {
      if (__DEV__) {
        console.log('Error reading language from storage:', e);
      }
      callback('pt-BR');
    }
  },
  cacheUserLanguage: async (language: string) => {
    try {
      if (isBrowser) {
        await saveStoredLanguage(language);
        return;
      }

      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (e) {
      if (__DEV__) {
        console.log('Error saving language to storage:', e);
      }
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
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
