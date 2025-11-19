import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

const MobileFloatingButtons = () => {
  const isMobile = useIsMobile();
  const languageRef = useMagneticEffect(0.4);
  const themeToggleRef = useMagneticEffect(0.4);

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-28 right-4 z-30 flex flex-col gap-2 animate-fade-in pointer-events-auto" style={{ animation: 'fadeInLeft 0.6s ease-out' }}>
      <div 
        ref={languageRef as React.RefObject<HTMLDivElement>}
        className="bg-background/80 backdrop-blur-md rounded-full p-1 shadow-glow border border-primary/20 pointer-events-auto transition-all duration-200 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-105 active:scale-95"
        style={{ transform: 'translate(var(--magnetic-x, 0), var(--magnetic-y, 0))' }}
      >
        <LanguageSelector />
      </div>
      <div 
        ref={themeToggleRef as React.RefObject<HTMLDivElement>}
        className="bg-background/80 backdrop-blur-md rounded-full p-1 shadow-glow border border-primary/20 pointer-events-auto transition-all duration-200 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-105 active:scale-95"
        style={{ transform: 'translate(var(--magnetic-x, 0), var(--magnetic-y, 0))' }}
      >
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MobileFloatingButtons;
