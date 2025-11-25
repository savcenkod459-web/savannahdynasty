import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useSmoothScroll = () => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Полностью отключаем на мобильных для максимальной производительности
    if (isMobile) return;
    
    // Отключаем на устройствах с слабым процессором
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return;

    let isScrolling = false;
    let scrollTarget = window.scrollY;
    let currentScroll = window.scrollY;

    const smoothScroll = () => {
      const difference = scrollTarget - currentScroll;
      
      if (Math.abs(difference) > 0.1) {
        currentScroll += difference * 0.15; // Более плавное и быстрое скроллирование
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
      
      scrollTarget += e.deltaY * 0.8; // Более естественная скорость
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
  }, [isMobile]);
};
