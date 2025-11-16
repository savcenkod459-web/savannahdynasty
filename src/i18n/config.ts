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
    // Try to get user's country from various sources
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language || navigator.languages?.[0];
    
    // Countries with multiple official languages
    const multiLanguageCountries: Record<string, string[]> = {
      'UA': ['uk', 'ru'], // Ukraine
      'BY': ['ru', 'be'], // Belarus
      'CH': ['de', 'fr', 'it'], // Switzerland
      'BE': ['nl', 'fr'], // Belgium
      'CA': ['en', 'fr'], // Canada
    };
    
    // Check if we need to show language selection
    const countryCode = timezone.split('/')[0];
    
    // For Ukraine, check if we need to prompt
    if (countryCode === 'Europe' && timezone.includes('Kiev')) {
      const savedLang = localStorage.getItem('i18nextLng');
      if (!savedLang) {
        // Show selection dialog between ru and uk
        const selection = window.confirm('Оберіть мову / Выберите язык\n\nУкраїнська (OK) / Русский (Cancel)');
        return selection ? 'uk' : 'ru';
      }
    }
    
    // Default language detection
    return language?.split('-')[0] || 'en';
  },
  cacheUserLanguage(lng: string) {
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
