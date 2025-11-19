import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShouldRender(true);
        setTimeout(() => setIsVisible(true), 10);
      } else {
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), 500);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  
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
      className={`fixed bottom-[420px] right-4 md:bottom-6 md:right-6 z-[9999] flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-110 cursor-pointer border border-primary/30 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        zIndex: 9999,
        boxShadow: '0 0 30px hsl(43 96% 56% / 0.4), 0 0 60px hsl(43 96% 56% / 0.2)',
      }}
    >
      <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
    </button>
  );
};

export default ScrollToTop;