import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { detectCountryAndLanguage } from '@/i18n/config';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  useEffect(() => {
    const checkLocation = async () => {
      const result = await detectCountryAndLanguage();
      
      if (result.showPicker && result.languages) {
        setAvailableLanguages(result.languages);
        setShowPicker(true);
      } else if (result.detectedLanguage && !localStorage.getItem('selectedLanguage')) {
        i18n.changeLanguage(result.detectedLanguage);
        localStorage.setItem('selectedLanguage', result.detectedLanguage);
      }
    };

    checkLocation();
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('selectedLanguage', lng);
    setShowPicker(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {i18n.language === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showPicker} onOpenChange={setShowPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('selectLanguage', 'Выберите язык / Select Language')}</DialogTitle>
            <DialogDescription>
              {t('multilingualCountry', 'Мы обнаружили, что вы находитесь в стране с несколькими языками. Пожалуйста, выберите предпочитаемый язык.')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {availableLanguages.map((code) => {
              const lang = languages.find(l => l.code === code);
              if (!lang) return null;
              
              return (
                <Button
                  key={code}
                  variant="outline"
                  className="justify-start gap-3 h-12"
                  onClick={() => changeLanguage(code)}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-base">{lang.name}</span>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
