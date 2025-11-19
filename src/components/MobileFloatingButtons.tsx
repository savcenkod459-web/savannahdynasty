import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

const MobileFloatingButtons = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-28 right-4 z-30 flex flex-col gap-2 animate-fade-in pointer-events-auto" style={{ animation: 'fadeInLeft 0.6s ease-out' }}>
      <div className="bg-background/80 backdrop-blur-md rounded-full p-1 shadow-glow border border-primary/20 pointer-events-auto">
        <LanguageSelector />
      </div>
      <div className="bg-background/80 backdrop-blur-md rounded-full p-1 shadow-glow border border-primary/20 pointer-events-auto">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MobileFloatingButtons;
