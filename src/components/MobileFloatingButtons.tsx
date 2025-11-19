import { useIsMobile } from "@/hooks/use-mobile";
import { Globe, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', buttonLabel: 'UK' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', buttonLabel: 'RU' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', buttonLabel: 'SA' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', buttonLabel: 'FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', buttonLabel: 'DE' },
  { code: 'es', name: 'Español', flag: '🇪🇸', buttonLabel: 'ES' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', buttonLabel: 'BR' },
  { code: 'zh', name: '中文', flag: '🇨🇳', buttonLabel: 'CN' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', buttonLabel: 'UA' },
];

const MobileFloatingButtons = () => {
  const isMobile = useIsMobile();
  const { i18n, t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    window.location.reload();
  };

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-28 right-4 z-30 flex flex-col gap-2 animate-fade-in pointer-events-auto" style={{ animation: 'fadeInLeft 0.6s ease-out' }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div 
            className="bg-background/80 backdrop-blur-md rounded-full p-2 shadow-glow border border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:border-primary/40 hover:translate-y-[-2px] active:scale-95 active:translate-y-0 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-foreground" />
            <span className="text-sm text-foreground">{currentLanguage.buttonLabel}</span>
          </div>
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

      <div 
        onClick={toggleTheme}
        className="bg-background/80 backdrop-blur-md rounded-full p-2 shadow-glow border border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:border-primary/40 hover:translate-y-[-2px] active:scale-95 active:translate-y-0 flex items-center justify-center"
        title={theme === "light" ? t("theme.switchToDark") : t("theme.switchToLight")}
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4 text-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-foreground" />
        )}
      </div>
    </div>
  );
};

export default MobileFloatingButtons;
