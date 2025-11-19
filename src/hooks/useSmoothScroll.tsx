import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Disable smooth scroll on mobile and tablet devices for better performance
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
    if (isMobile) return;

    let isScrolling = false;
    let scrollTarget = window.scrollY;
    let currentScroll = window.scrollY;

    const smoothScroll = () => {
      const difference = scrollTarget - currentScroll;
      
      if (Math.abs(difference) > 0.1) {
        currentScroll += difference * 0.06;
        window.scrollTo(0, currentScroll);
        requestAnimationFrame(smoothScroll);
      } else {
        isScrolling = false;
        currentScroll = scrollTarget;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const actualScroll = window.scrollY;
      if (Math.abs(actualScroll - currentScroll) > 50) {
        scrollTarget = actualScroll;
        currentScroll = actualScroll;
      }
      
      scrollTarget += e.deltaY * 0.4;
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
