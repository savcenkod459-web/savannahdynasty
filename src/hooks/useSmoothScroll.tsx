import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    let isScrolling = false;
    let scrollTarget = window.scrollY;

    const smoothScroll = () => {
      const currentScroll = window.scrollY;
      const difference = scrollTarget - currentScroll;
      
      if (Math.abs(difference) > 0.5) {
        window.scrollTo(0, currentScroll + difference * 0.15);
        requestAnimationFrame(smoothScroll);
      } else {
        isScrolling = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      scrollTarget += e.deltaY;
      scrollTarget = Math.max(0, Math.min(scrollTarget, document.documentElement.scrollHeight - window.innerHeight));
      
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
};
