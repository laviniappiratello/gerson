import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
  return useI18nTranslation('translation');
}

export function useLanguage() {
  const { i18n } = useI18nTranslation();

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
  };
}
