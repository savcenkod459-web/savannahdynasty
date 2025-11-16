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

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
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
          <span className="hidden sm:inline text-sm">{currentLanguage.flag}</span>
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
