import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

const MobileFloatingButtons = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      <div className="bg-background/80 backdrop-blur-md rounded-full p-1 shadow-glow border border-primary/20">
        <LanguageSelector />
      </div>
      <div className="bg-background/80 backdrop-blur-md rounded-full p-1 shadow-glow border border-primary/20">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MobileFloatingButtons;
