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
  uk: { translation: uk }
};

// Countries with multiple common languages
const multilingualCountries: Record<string, string[]> = {
  'UA': ['uk', 'ru'], // Ukraine
  'BY': ['ru', 'be'], // Belarus
  'CH': ['de', 'fr', 'it'], // Switzerland
  'BE': ['nl', 'fr'], // Belgium
  'CA': ['en', 'fr'], // Canada
};

// Detect user's country and show language picker if needed
const detectCountryAndLanguage = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    
    // Check if user is from a multilingual country
    if (multilingualCountries[countryCode]) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      
      // If no language was previously selected, show picker
      if (!savedLanguage) {
        return {
          showPicker: true,
          languages: multilingualCountries[countryCode],
          detectedLanguage: data.languages?.[0]?.split('-')[0] || 'en'
        };
      }
    }
    
    // For other countries, use detected language
    const detectedLang = data.languages?.[0]?.split('-')[0] || 'en';
    const supportedLangs = Object.keys(resources);
    
    return {
      showPicker: false,
      detectedLanguage: supportedLangs.includes(detectedLang) ? detectedLang : 'en'
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    return {
      showPicker: false,
      detectedLanguage: 'en'
    };
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('selectedLanguage') || undefined,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export { detectCountryAndLanguage };
export default i18n;
