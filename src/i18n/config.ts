import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';
import uk from './locales/uk.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  ar: { translation: ar },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  pt: { translation: pt },
  zh: { translation: zh },
  uk: { translation: uk },
};

// Custom language detector with country-specific logic
const customLanguageDetector = {
  name: 'customDetector',
  lookup() {
    // ALWAYS check localStorage first
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang) {
      console.log('Loading saved language from localStorage:', savedLang);
      return savedLang;
    }
    
    // If no saved language, try to detect
    console.log('No saved language, detecting...');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language || navigator.languages?.[0];
    
    // For Ukraine, check if we need to prompt
    if (timezone.includes('Kiev') || timezone.includes('Kyiv')) {
      // Show selection dialog between ru and uk
      const selection = window.confirm('Оберіть мову / Выберите язык\n\nУкраїнська (OK) / Русский (Cancel)');
      const selectedLang = selection ? 'uk' : 'ru';
      console.log('Ukraine detected, user selected:', selectedLang);
      return selectedLang;
    }
    
    // Default language detection
    const detectedLang = language?.split('-')[0] || 'en';
    console.log('Detected language from browser:', detectedLang);
    return detectedLang;
  },
  cacheUserLanguage(lng: string) {
    console.log('Caching language to localStorage:', lng);
    localStorage.setItem('i18nextLng', lng);
  }
};

i18n
  .use({
    type: 'languageDetector',
    detect: customLanguageDetector.lookup,
    cacheUserLanguage: customLanguageDetector.cacheUserLanguage,
  } as any)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'customDetector', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
