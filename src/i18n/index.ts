import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import messages from './local/index';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ar',
    fallbackLng: 'ar',
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
  });

// Set RTL and lang immediately
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'ar';

export default i18n;