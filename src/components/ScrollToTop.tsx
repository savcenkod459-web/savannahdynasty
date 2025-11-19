import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

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
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed top-1/2 -translate-y-1/2 right-4 md:right-8 z-50 rounded-full shadow-glow animate-fade-in bg-primary hover:bg-primary/90 text-primary-foreground w-12 h-12 md:w-14 md:h-14"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6 md:h-7 md:w-7" />
        </Button>
      )}
    </>
  );
};

export default ScrollToTop;
