import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
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
  
  if (!isVisible) return null;
  
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground shadow-elegant hover:scale-110 hover:shadow-glow transition-all duration-300 cursor-pointer border-2 border-primary/20"
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999
      }}
    >
      <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
    </button>
  );
};

export default ScrollToTop;