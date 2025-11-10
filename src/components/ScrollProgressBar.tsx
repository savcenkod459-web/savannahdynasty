import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out shadow-[0_0_20px_rgba(217,179,112,0.6)]"
        style={{ 
          width: `${scrollProgress}%`,
          boxShadow: scrollProgress > 0 ? '0 0 20px rgba(217,179,112,0.6), 0 0 40px rgba(217,179,112,0.4)' : 'none'
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
