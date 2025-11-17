import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', label: 'UK' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', label: 'RU' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', label: 'SA' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', label: 'FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', label: 'DE' },
  { code: 'es', name: 'Español', flag: '🇪🇸', label: 'ES' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', label: 'BR' },
  { code: 'zh', name: '中文', flag: '🇨🇳', label: 'CN' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', label: 'UA' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  const changeLanguage = async (code: string) => {
    // Wait for language change to complete and save to localStorage
    await i18n.changeLanguage(code);
    // Ensure it's saved in localStorage
    localStorage.setItem('i18nextLng', code);
    // Reload page to show preloader and apply new language
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-1.5 hover:bg-primary/10 text-foreground hover:text-foreground text-sm px-2.5 py-1.5 h-auto"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-sm">{currentLanguage.flag} {currentLanguage.label}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-background/95 backdrop-blur-lg border-primary/20">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer gap-2 hover:bg-primary/10 focus:bg-primary/10 text-foreground hover:text-foreground focus:text-foreground ${
              i18n.language === language.code ? 'bg-primary font-semibold text-primary-foreground' : ''
            }`}
          >
            <span className="text-xl">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
