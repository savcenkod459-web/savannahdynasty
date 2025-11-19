import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
        setShouldRender(true);
        setIsLeaving(false);
      } else {
        if (isVisible) {
          setIsLeaving(true);
          setTimeout(() => {
            setIsVisible(false);
            setShouldRender(false);
            setIsLeaving(false);
          }, 500);
        }
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [isVisible]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  if (!shouldRender) return null;
  
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-48 right-4 md:bottom-6 md:right-6 z-[9999] flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-110 transition-all duration-300 cursor-pointer border border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-500"
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        zIndex: 9999,
        boxShadow: '0 0 30px hsl(43 96% 56% / 0.4), 0 0 60px hsl(43 96% 56% / 0.2)',
        animation: isLeaving ? 'fadeOutSlide 0.5s ease-out forwards' : 'fadeInSlide 0.5s ease-out forwards'
      }}
    >
      <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
    </button>
  );
};

export default ScrollToTop;